"""Gera os dados e os áudios do app a partir de content/.

Uso:  python tools/build.py            (gera tudo que estiver faltando)
      python tools/build.py --no-audio (só os JSON, sem chamar a voz)

Entrada:  content/curriculum.json
          content/pronuncia.json         (como a voz deve falar termos em inglês)
          content/mXX/NN-slug.md         (aulas; front matter simples entre ---)
          content/mXX/NN-slug.quiz.json  (perguntas de fim de aula, opcional)
          content/mXX/quiz.json          (questões do módulo)
          content/mXX/glossary.json      (opcional)
Saída:    docs/data/*.json e docs/audio/**.mp3  (docs/ é o site publicado)
          content/_timings/*.json        (tempo de cada palavra, para o texto sincronizado)
"""
import asyncio
import difflib
import hashlib
import html
import json
import re
import sys
import unicodedata
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
DOCS = ROOT / "docs"
TIMINGS = CONTENT / "_timings"
# Voz só em português (a "Multilingual" às vezes trocava para espanhol).
# Masculina, escolhida pelo usuário.
VOICE = "pt-BR-AntonioNeural"
RATE = "+0%"
BITRATE = 48000  # formato padrão do edge-tts: 24 kHz, 48 kbps, mono

NO_AUDIO = "--no-audio" in sys.argv


# ---------------------------------------------------------------- pronúncia

def load_pronuncia():
    """Lista [termo, como falar]. Siglas em maiúsculas casam exatamente;
    o resto ignora maiúsculas/minúsculas. Termos mais longos primeiro."""
    raw = json.loads((CONTENT / "pronuncia.json").read_text(encoding="utf-8"))
    rules = []
    for term, say in sorted(raw, key=lambda r: -len(r[0])):
        flags = 0 if term.upper() == term else re.IGNORECASE
        pat = re.compile(r"(?<![\w-])" + re.escape(term) + r"(?![\w-])", flags)
        rules.append((pat, say))
    return rules


PRONUNCIA = load_pronuncia()


def fix_speech(text: str) -> str:
    for pat, say in PRONUNCIA:
        text = pat.sub(say, text)
    return text


# ---------------------------------------------------------------- texto

def parse_md(path: Path):
    raw = path.read_text(encoding="utf-8")
    meta = {}
    body = raw
    if raw.startswith("---"):
        _, fm, body = raw.split("---", 2)
        for line in fm.strip().splitlines():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta, body.strip()


def inline_html(text: str) -> str:
    t = html.escape(text, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\*(.+?)\*", r"<em>\1</em>", t)
    return t


def strip_inline(text: str) -> str:
    return re.sub(r"\*\*?(.+?)\*\*?", r"\1", text)


def end_sentence(t: str) -> str:
    t = t.strip()
    return t if t[-1:] in ".!?:;" else t + "."


def blocks(body: str):
    """Divide o markdown em blocos: ('h', texto) | ('p', texto) | ('ul', [itens])."""
    out = []
    for chunk in re.split(r"\n\s*\n", body):
        lines = [l.rstrip() for l in chunk.strip().splitlines() if l.strip()]
        if not lines:
            continue
        if lines[0].startswith("## "):
            out.append(("h", lines[0][3:].strip()))
            lines = lines[1:]
            if not lines:
                continue
        if all(l.lstrip().startswith("- ") for l in lines):
            out.append(("ul", [l.lstrip()[2:].strip() for l in lines]))
        else:
            out.append(("p", " ".join(l.strip() for l in lines)))
    return out


SENT_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[\"“(*]*[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9])")


def segments(intro: str, body: str):
    """Lista de trechos (frases, títulos, itens) com texto exibido e falado."""
    segs = [{"k": "t", "b": 0, "md": intro}]
    for bi, (kind, val) in enumerate(blocks(body), 1):
        if kind == "h":
            segs.append({"k": "h", "b": bi, "md": val})
        elif kind == "p":
            for s in SENT_SPLIT.split(val):
                if s.strip():
                    segs.append({"k": "p", "b": bi, "md": s.strip()})
        else:
            for item in val:
                segs.append({"k": "li", "b": bi, "md": item})
    for s in segs:
        plain = strip_inline(s["md"])
        s["speech"] = fix_speech(end_sentence(plain) if s["k"] in ("t", "h", "li") else plain)
        s["html"] = inline_html(s["md"])
    return segs


def segments_speech(segs) -> str:
    out, last_b = [], None
    for s in segs:
        sep = "" if last_b is None else (" " if s["b"] == last_b and s["k"] == "p" else "\n\n" if s["b"] != last_b else "\n")
        out.append(sep + s["speech"])
        last_b = s["b"]
    return "".join(out)


# ---------------------------------------------------------------- alinhamento

def norm_tokens(text: str):
    t = unicodedata.normalize("NFKD", text.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.findall(r"[a-z0-9]+", t)


def align(segs, words, total):
    """Dá a cada trecho o instante (s) em que começa, casando as palavras
    faladas (eventos da voz) com as palavras do texto."""
    mine, owner = [], []
    for i, s in enumerate(segs):
        toks = norm_tokens(s["speech"])
        mine += toks
        owner += [i] * len(toks)
    theirs, times = [], []
    for w in words:
        for tok in norm_tokens(w["text"]):
            theirs.append(tok)
            times.append(w["offset"])
    start = [None] * len(segs)
    sm = difflib.SequenceMatcher(None, mine, theirs, autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            si = owner[a + k]
            if start[si] is None:
                start[si] = times[b + k]
    # trechos sem casamento: interpola entre vizinhos
    known = [(i, t) for i, t in enumerate(start) if t is not None]
    if not known:
        return [round(total * i / len(segs), 2) for i in range(len(segs))]
    for i in range(len(segs)):
        if start[i] is None:
            prev = max(((j, t) for j, t in known if j < i), default=(0, 0.0))
            nxt = min(((j, t) for j, t in known if j > i), default=(len(segs), total))
            start[i] = prev[1] + (nxt[1] - prev[1]) * (i - prev[0]) / max(1, nxt[0] - prev[0])
    for i in range(1, len(start)):  # garante ordem crescente
        start[i] = max(start[i], start[i - 1])
    start[0] = 0.0
    return [round(t, 2) for t in start]


# ---------------------------------------------------------------- áudio

class AudioJobs:
    def __init__(self):
        self.jobs = {}  # caminho -> (texto, quer_tempos)

    def add(self, folder: str, name: str, text: str, timings=False) -> str:
        h = hashlib.sha1(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()[:10]
        rel = f"audio/{folder}/{name}-{h}.mp3"
        self.jobs[DOCS / rel] = (text, timings)
        return rel

    @staticmethod
    def timing_path(path: Path) -> Path:
        return TIMINGS / (path.stem + ".json")

    def missing(self, path, timings):
        return not path.exists() or (timings and not self.timing_path(path).exists())

    async def run(self):
        todo = [(p, t, w) for p, (t, w) in self.jobs.items() if self.missing(p, w)]
        if NO_AUDIO:
            print(f"(--no-audio) {len(todo)} áudios pendentes não foram gerados")
            return
        print(f"{len(self.jobs)} áudios no total, {len(todo)} para gerar")
        sem = asyncio.Semaphore(4)

        async def one(path: Path, text: str, timings: bool):
            async with sem:
                path.parent.mkdir(parents=True, exist_ok=True)
                for tentativa in range(4):
                    try:
                        audio, words = bytearray(), []
                        com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
                        async for ch in com.stream():
                            if ch["type"] == "audio":
                                audio += ch["data"]
                            elif ch["type"] == "WordBoundary":
                                words.append({"offset": ch["offset"] / 1e7, "text": ch["text"]})
                        path.write_bytes(audio)
                        if timings:
                            TIMINGS.mkdir(parents=True, exist_ok=True)
                            self.timing_path(path).write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
                        print("  ok", path.relative_to(DOCS))
                        return
                    except Exception as e:  # rede instável: tenta de novo
                        print(f"  falhou ({tentativa + 1}/4) {path.name}: {e}")
                        await asyncio.sleep(3 * (tentativa + 1))
                raise RuntimeError(f"não consegui gerar {path}")

        await asyncio.gather(*(one(p, t, w) for p, t, w in todo))

    def clean(self):
        """Apaga mp3 e tempos antigos que não são mais usados."""
        keep = set(self.jobs)
        for mp3 in (DOCS / "audio").rglob("*.mp3"):
            if mp3 not in keep:
                print("  removendo antigo", mp3.relative_to(DOCS))
                mp3.unlink()
        keep_t = {self.timing_path(p) for p in keep}
        if TIMINGS.exists():
            for t in TIMINGS.glob("*.json"):
                if t not in keep_t:
                    t.unlink()


def duration(rel: str) -> int:
    p = DOCS / rel
    return round(p.stat().st_size * 8 / BITRATE) if p.exists() else 0


# ---------------------------------------------------------------- questões

LETRAS = "ABCDE"
NUMEROS = {2: "duas", 3: "três"}


def build_questions(qs, jobs, folder, prefix, audio_prefix, where):
    out = []
    total = len(qs)
    for i, q in enumerate(qs, 1):
        certas = q["certa"] if isinstance(q["certa"], list) else [q["certa"]]
        n_opts = len(q["opcoes"])
        assert 4 <= n_opts <= 5, f"{where} questão {i}: precisa de 4 ou 5 opções"
        assert all(0 <= c < n_opts for c in certas), f"{where} questão {i}: 'certa' inválida"
        opts = " ".join(f"Alternativa {LETRAS[k]}: {end_sentence(o)}" for k, o in enumerate(q["opcoes"]))
        pede = f" Escolha {NUMEROS[len(certas)]} alternativas." if len(certas) > 1 else ""
        q_speech = fix_speech(f"Pergunta {i} de {total}. {q['pergunta']}{pede}\n\n{opts}")
        if len(certas) == 1:
            certo_txt = f"A resposta certa é a alternativa {LETRAS[certas[0]]}: {end_sentence(q['opcoes'][certas[0]])}"
        else:
            letras = ", ".join(LETRAS[c] for c in certas[:-1]) + f" e {LETRAS[certas[-1]]}"
            certo_txt = f"As respostas certas são as alternativas {letras}."
        e_speech = fix_speech(f"{certo_txt} {q['explicacao']}")
        qid = hashlib.sha1(q["pergunta"].encode()).hexdigest()[:8]
        out.append({
            "id": f"{prefix}-q{qid}",
            "q": q["pergunta"],
            "options": q["opcoes"],
            "answer": certas,
            "explanation": q["explicacao"],
            "audioQ": jobs.add(folder, f"{audio_prefix}{i:02d}-pergunta", q_speech),
            "audioE": jobs.add(folder, f"{audio_prefix}{i:02d}-explicacao", e_speech),
        })
    return out


# ---------------------------------------------------------------- build

def build():
    cur = json.loads((CONTENT / "curriculum.json").read_text(encoding="utf-8"))
    jobs = AudioJobs()
    common = {
        "right": jobs.add("common", "certo", "Isso mesmo, você acertou!"),
        "wrong": jobs.add("common", "errado", "Não foi dessa vez."),
    }
    modules = []
    for mod in cur["modules"]:
        folder = CONTENT / mod["id"]
        lesson_files = sorted(folder.glob("[0-9][0-9]-*.md")) if folder.exists() else []
        if not lesson_files:
            modules.append({**mod, "available": False})
            continue

        lessons = []
        n_aula = 0
        for f in lesson_files:
            meta, body = parse_md(f)
            kind = meta.get("tipo", "aula")
            lid = f"{mod['id']}-{f.stem}"
            if kind == "aula":
                n_aula += 1
                label = f"Aula {n_aula}"
                intro = f"Módulo {mod['num']}, aula {n_aula}. {meta['titulo']}"
            else:
                label = "Revisão"
                intro = f"Módulo {mod['num']}. Pílula de revisão. {meta['titulo']}"
            segs = segments(intro, body)
            audio = jobs.add(mod["id"], f.stem, segments_speech(segs), timings=True)
            lquiz = []
            qf = f.with_suffix(".quiz.json")
            if qf.exists():
                lquiz = build_questions(json.loads(qf.read_text(encoding="utf-8")), jobs, mod["id"],
                                        lid, f"{f.stem[:2]}-aula-", f"{lid}")
            lessons.append({
                "id": lid,
                "kind": kind,
                "label": label,
                "title": meta["titulo"],
                "summary": meta.get("resumo", ""),
                "audio": audio,
                "_segs": segs,
                "quiz": lquiz,
                "words": len(body.split()),
            })

        quiz = []
        qfile = folder / "quiz.json"
        if qfile.exists():
            quiz = build_questions(json.loads(qfile.read_text(encoding="utf-8")), jobs, mod["id"],
                                   mod["id"], "quiz-", mod["id"])

        glossary = []
        gfile = folder / "glossary.json"
        if gfile.exists():
            glossary = json.loads(gfile.read_text(encoding="utf-8"))

        modules.append({**mod, "available": True, "_lessons": lessons, "_quiz": quiz,
                        "_glossary": glossary})

    asyncio.run(jobs.run())
    if not NO_AUDIO:
        jobs.clean()

    data_dir = DOCS / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    out_modules = []
    for m in modules:
        if not m["available"]:
            out_modules.append(m)
            continue
        lessons = m.pop("_lessons")
        quiz = m.pop("_quiz")
        glossary = m.pop("_glossary")
        for l in lessons:
            l["duration"] = duration(l["audio"])
            segs = l.pop("_segs")
            tp = AudioJobs.timing_path(DOCS / l["audio"])
            words = json.loads(tp.read_text(encoding="utf-8")) if tp.exists() else []
            times = align(segs, words, l["duration"])
            l["segs"] = [{"k": s["k"], "b": s["b"], "t": t, "h": s["html"]} for s, t in zip(segs, times)]
        all_q = quiz + [q for l in lessons for q in l["quiz"]]
        for q in all_q:
            q["durQ"] = duration(q["audioQ"])
            q["durE"] = duration(q["audioE"])
        audio_files = [l["audio"] for l in lessons] + [a for q in all_q for a in (q["audioQ"], q["audioE"])]
        audio_bytes = sum((DOCS / a).stat().st_size for a in audio_files if (DOCS / a).exists())
        summary = {
            **m,
            "lessonCount": len(lessons),
            "questionCount": len(quiz),
            "totalDuration": sum(l["duration"] for l in lessons),
            "audioBytes": audio_bytes,
        }
        out_modules.append(summary)
        (data_dir / f"{m['id']}.json").write_text(
            json.dumps({**summary, "lessons": lessons, "quiz": quiz, "glossary": glossary,
                        "audioFiles": audio_files}, ensure_ascii=False, indent=1),
            encoding="utf-8")

    cur_out = {k: v for k, v in cur.items() if k != "modules"}
    cur_out["modules"] = out_modules
    cur_out["commonAudio"] = common
    (data_dir / "curriculum.json").write_text(
        json.dumps(cur_out, ensure_ascii=False, indent=1), encoding="utf-8")

    stamp_service_worker()
    print("pronto.")


def stamp_service_worker():
    """Atualiza a versão do service worker com um hash do app + dados."""
    h = hashlib.sha1()
    for p in sorted(DOCS.rglob("*")):
        if p.is_file() and p.suffix in {".html", ".js", ".css", ".json", ".webmanifest", ".png"} \
                and p.name != "sw.js" and "_amostras" not in p.parts:
            h.update(p.relative_to(DOCS).as_posix().encode())
            h.update(p.read_bytes())
    sw = DOCS / "sw.js"
    if sw.exists():
        txt = sw.read_text(encoding="utf-8")
        txt = re.sub(r"const VERSION = '[^']*';", f"const VERSION = '{h.hexdigest()[:10]}';", txt)
        sw.write_text(txt, encoding="utf-8")


if __name__ == "__main__":
    build()
