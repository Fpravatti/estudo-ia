---
tipo: revisao
titulo: Os pontos-chave do módulo 1
resumo: Revisão rápida de tudo o que mais cai do módulo, para ouvir de novo nos dias seguintes.
---
Esta é a pílula de revisão do módulo 1. Ouça mais de uma vez nos próximos dias. Se algum ponto parecer nebuloso, volte à aula correspondente.

## Panorama

IA generativa gera conteúdo novo. Machine learning tradicional, discriminativo, classifica ou prevê. Para dados estruturados com saída de classe ou número, como fraude e risco de crédito, prefira machine learning tradicional. Para texto, documentos e imagens, IA generativa. Texto usa Transformers autorregressivos, e imagem usa difusão. Modelo fundacional é treinado com dados amplos e adaptado para muitas tarefas, e pode ser proprietário, via API, ou de pesos abertos, com atenção à licença.

## Tokens e inferência

Tokenizadores quebram o texto em subpalavras, com BPE, WordPiece ou SentencePiece. Custo e limite são medidos em tokens, e a saída costuma custar mais. A janela de contexto soma entrada e saída. Resposta cortada aponta para o max tokens ou para estouro de contexto. Temperatura baixa concentra e deixa previsível. Temperatura zero é quase gulosa. Top-k usa os k melhores. Top-p usa o núcleo que soma p. Respostas longas aumentam custo e latência. Streaming melhora a experiência, não o tempo total.

## Arquiteturas

Encoder-only, como o BERT: atenção bidirecional, tokens mascarados, classificação e embeddings. Decoder-only, como GPT e Llama: atenção causal, próximo token, geração. Encoder-decoder, como T5 e BART: tradução e sumarização. Embeddings colocam textos parecidos perto uns dos outros, e sustentam a busca semântica.

## Pré-treinamento

Autossupervisionado, com curadoria pesada. FP32 usa 4 bytes por parâmetro, e treinar exige cerca de seis vezes a memória dos pesos. BF16 usa 2 bytes e é estável. INT8 usa 1 byte. Quantizar reduz memória. Chinchilla: cerca de 20 tokens por parâmetro, e modelo maior não é automaticamente melhor. Pré-treinar do zero quase nunca vale a pena.

## Fine-tuning

Aprendizado em contexto não muda parâmetros, e fine-tuning muda. Para tarefa única, de 500 a 1000 bons exemplos já ajudam. Esquecimento catastrófico se evita com multitarefa, como no FLAN, ou com PEFT. LoRA treina matrizes de baixo posto, menos de um por cento dos parâmetros, e pode ser mesclado sem latência. QLoRA usa o modelo base em 4 bits. Soft prompts treinam vetores virtuais. Fine-tuning muda comportamento. RAG traz conhecimento.

## Alinhamento

RLHF: modelo SFT, modelo de recompensa treinado com comparações humanas, e reforço com PPO. Reward hacking se contém com penalidade KL contra um modelo de referência. DPO dispensa o modelo de recompensa. IA constitucional usa princípios escritos e feedback de IA. Modelos de raciocínio usam reforço com recompensas verificáveis, como no GRPO.

## Avaliação

ROUGE, para resumo, orientado à revocação. BLEU, para tradução, orientado à precisão. Ambos medem sobreposição de n-gramas. MMLU tem 57 matérias. HELM é holístico. Cuidado com contaminação. LLM como juiz tem vieses de tamanho e de posição. O centro é um conjunto de avaliação próprio, para detectar regressões.

## Limitações

Alucinação e data de corte: RAG e ferramentas. Contexto longo: efeito perdido no meio. Aritmética: PAL, com o modelo escrevendo código e o interpretador executando. ReAct: pensamento, ação, observação. O modelo pede a ferramenta, e a aplicação executa. Prompt injection pode ser direto ou indireto. Para produção: destilação, quantização e poda.

## Ciclo de vida

Escopo, escolha do modelo, adaptação com avaliação contínua, integração e monitoramento. A escada: prompt, RAG, fine-tuning, pré-treino. A palavra "melhor" inclui custo e latência. Roteamento entre modelos reduz custo. IA responsável atravessa todas as fases.

Agora, faça o quiz do módulo 1. As questões seguem o estilo de cenário que você vai encontrar na prova.
