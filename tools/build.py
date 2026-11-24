"""Gera os dados e os áudios do app a partir de content/.

Uso:  python tools/build.py            (gera tudo que estiver faltando)
      python tools/build.py --no-audio (só os JSON, sem chamar a voz)

Entrada:  content/curriculum.json
          content/mXX/NN-slug.md   (aulas; front matter simples entre ---)
          content/mXX/quiz.json    (questões do módulo)
          content/mXX/glossary.json (opcional)
Saída:    docs/data/*.json e docs/audio/**.mp3  (docs/ é o site publicado)
"""
import asyncio
import hashlib
import html
import json
import re
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
DOCS = ROOT / "docs"
VOICE = "pt-BR-ThalitaMultilingualNeural"
RATE = "+0%"
BITRATE = 48000  # formato padrão do edge-tts: 24 kHz, 48 kbps, mono

# Ajustes de pronúncia (só afetam o áudio, nunca o texto mostrado).
PRONUNCIA = {
    r"\bLLMs\b": "éle éle émes",
    r"\bLLM\b": "éle éle ême",
    r"\bIA\b": "I A",
    r"\bRLHF\b": "érre éle agá éfe",
    r"\bRAG\b": "rég",
    r"\bAPI\b": "a pê í",
    r"\bAPIs\b": "a pê ís",
    r"\bGPUs\b": "gê pê ús",
    r"\bGPU\b": "gê pê ú",
    r"\bLGPD\b": "éle gê pê dê",
    r"\bLoRA\b": "Lóra",
    r"\bPEFT\b": "pêfti",
}

NO_AUDIO = "--no-audio" in sys.argv


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


def md_to_html(body: str) -> str:
    parts = []
    for kind, val in blocks(body):
        if kind == "h":
            parts.append(f"<h3>{inline_html(val)}</h3>")
        elif kind == "p":
            parts.append(f"<p>{inline_html(val)}</p>")
        else:
            items = "".join(f"<li>{inline_html(i)}</li>" for i in val)
            parts.append(f"<ul>{items}</ul>")
    return "\n".join(parts)


def end_sentence(t: str) -> str:
    t = t.strip()
    return t if t[-1:] in ".!?:;" else t + "."


def md_to_speech(body: str) -> str:
    parts = []
    for kind, val in blocks(body):
        if kind == "h":
            parts.append(end_sentence(strip_inline(val)))
        elif kind == "p":
            parts.append(strip_inline(val))
        else:
            parts.append("\n".join(end_sentence(strip_inline(i)) for i in val))
    return fix_speech("\n\n".join(parts))


def fix_speech(text: str) -> str:
    for pat, rep in PRONUNCIA.items():
        text = re.sub(pat, rep, text)
    return text


# ---------------------------------------------------------------- áudio

class AudioJobs:
    def __init__(self):
        self.jobs = {}  # caminho -> texto

    def add(self, folder: str, name: str, text: str) -> str:
        h = hashlib.sha1(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()[:10]
        rel = f"audio/{folder}/{name}-{h}.mp3"
        self.jobs[DOCS / rel] = text
        return rel

    async def run(self):
        todo = [(p, t) for p, t in self.jobs.items() if not p.exists()]
        if NO_AUDIO:
            print(f"(--no-audio) {len(todo)} áudios pendentes não foram gerados")
            return
        print(f"{len(self.jobs)} áudios no total, {len(todo)} para gerar")
        sem = asyncio.Semaphore(4)

        async def one(path: Path, text: str):
            async with sem:
                path.parent.mkdir(parents=True, exist_ok=True)
                tmp = path.with_suffix(".part")
                for tentativa in range(4):
                    try:
                        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(tmp))
                        tmp.replace(path)
                        print("  ok", path.relative_to(DOCS))
                        return
                    except Exception as e:  # rede instável: tenta de novo
                        print(f"  falhou ({tentativa + 1}/4) {path.name}: {e}")
                        await asyncio.sleep(3 * (tentativa + 1))
                raise RuntimeError(f"não consegui gerar {path}")

        await asyncio.gather(*(one(p, t) for p, t in todo))

    def clean(self):
        """Apaga mp3 antigos que não são mais usados."""
        keep = set(self.jobs)
        for mp3 in (DOCS / "audio").rglob("*.mp3"):
            if mp3 not in keep:
                print("  removendo antigo", mp3.relative_to(DOCS))
                mp3.unlink()


def duration(rel: str) -> int:
    p = DOCS / rel
    return round(p.stat().st_size * 8 / BITRATE) if p.exists() else 0


# ---------------------------------------------------------------- build

LETRAS = "ABCD"


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
            lid = f"{mod['id']}-{f.stem[:2]}"
            if kind == "aula":
                n_aula += 1
                label = f"Aula {n_aula}"
                intro = f"Módulo {mod['num']}, aula {n_aula}. {meta['titulo']}."
            else:
                label = "Revisão"
                intro = f"Módulo {mod['num']}. Pílula de revisão. {meta['titulo']}."
            speech = fix_speech(intro) + "\n\n" + md_to_speech(body)
            audio = jobs.add(mod["id"], f.stem, speech)
            lessons.append({
                "id": lid,
                "kind": kind,
                "label": label,
                "title": meta["titulo"],
                "summary": meta.get("resumo", ""),
                "audio": audio,
                "html": md_to_html(body),
                "words": len(body.split()),
            })

        quiz = []
        qfile = folder / "quiz.json"
        if qfile.exists():
            qs = json.loads(qfile.read_text(encoding="utf-8"))
            total = len(qs)
            for i, q in enumerate(qs, 1):
                assert len(q["opcoes"]) == 4, f"{mod['id']} questão {i}: precisa de 4 opções"
                opts = " ".join(
                    f"Alternativa {LETRAS[k]}: {end_sentence(o)}" for k, o in enumerate(q["opcoes"])
                )
                q_speech = fix_speech(f"Pergunta {i} de {total}. {q['pergunta']}\n\n{opts}")
                certa = q["certa"]
                e_speech = fix_speech(
                    f"A resposta certa é a alternativa {LETRAS[certa]}: "
                    f"{end_sentence(q['opcoes'][certa])} {q['explicacao']}"
                )
                quiz.append({
                    "id": f"{mod['id']}-q{i:02d}",
                    "q": q["pergunta"],
                    "options": q["opcoes"],
                    "answer": certa,
                    "explanation": q["explicacao"],
                    "audioQ": jobs.add(mod["id"], f"quiz-{i:02d}-pergunta", q_speech),
                    "audioE": jobs.add(mod["id"], f"quiz-{i:02d}-explicacao", e_speech),
                })

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
        for q in quiz:
            q["durQ"] = duration(q["audioQ"])
            q["durE"] = duration(q["audioE"])
        audio_files = [l["audio"] for l in lessons] + [a for q in quiz for a in (q["audioQ"], q["audioE"])]
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
                and p.name != "sw.js":
            h.update(p.relative_to(DOCS).as_posix().encode())
            h.update(p.read_bytes())
    sw = DOCS / "sw.js"
    if sw.exists():
        txt = sw.read_text(encoding="utf-8")
        txt = re.sub(r"const VERSION = '[^']*';", f"const VERSION = '{h.hexdigest()[:10]}';", txt)
        sw.write_text(txt, encoding="utf-8")


if __name__ == "__main__":
    build()
