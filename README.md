# Estudo IA

App de estudos em áudio, offline, para a trilha "Engenheiro de IA". Ele é instalável no Android como PWA.

- `content/`: as aulas (Markdown), o quiz e o glossário de cada módulo.
- `tools/build.py`: gera os áudios (voz neural pt-BR via `edge-tts`) e os dados do app em `docs/`.
- `docs/`: o site publicado no GitHub Pages.

Para gerar de novo depois de editar o conteúdo:

```
pip install edge-tts
python tools/build.py
```

O material foi criado com IA a partir dos temas da trilha. Não é o conteúdo oficial dos cursos.
