---
titulo: Como avaliar LLMs: métricas e benchmarks
resumo: Por que avaliar LLM é difícil, ROUGE, BLEU, perplexidade, benchmarks como GLUE, SuperGLUE, MMLU, BIG-bench e HELM, avaliação humana e LLM como juiz.
---
Num modelo de classificação tradicional, avaliar é simples: comparar a previsão com o rótulo e calcular a acurácia. Com LLMs, a saída é texto livre, e duas respostas completamente diferentes podem estar igualmente certas. Nesta aula, vamos ver as métricas clássicas, os benchmarks mais citados e as formas modernas de avaliação. O módulo 8 aprofunda a avaliação de aplicações, RAG e agentes.

## O problema

Considere a frase de referência "o cliente pediu o cancelamento do cartão". O modelo gerou "o consumidor solicitou que o cartão fosse cancelado". Significado igual, quase nenhuma palavra em comum. E o contrário também acontece: "o cliente não pediu o cancelamento do cartão" tem quase todas as palavras iguais à referência, e o significado oposto. Toda métrica automática baseada em palavras sofre com isso.

## Unigramas, bigramas e n-gramas

Antes das métricas, um vocabulário. Um **unigrama** é uma palavra isolada. Um **bigrama** é uma sequência de duas palavras. Um **n-grama** é uma sequência de n palavras. As métricas clássicas contam quantos n-gramas do texto gerado coincidem com os de um texto de referência escrito por uma pessoa.

## ROUGE: para sumarização

O **ROUGE** foi criado para avaliar **resumos**. Ele é orientado à **revocação**, em inglês **recall**: mede quanto do conteúdo da referência aparece no texto gerado. A pergunta que ele responde é: o resumo cobriu o que devia cobrir?

Ele tem variações. O **ROUGE-1** compara unigramas. O **ROUGE-2** compara bigramas, e por isso captura um pouco da ordem das palavras. E o **ROUGE-L** usa a **maior subsequência comum** entre os dois textos, a sequência mais longa de palavras que aparece na mesma ordem nos dois, mesmo que não seja contígua. Normalmente se calculam revocação, precisão e a combinação das duas, chamada **F1**.

## BLEU: para tradução

O **BLEU** foi criado para avaliar **tradução automática**. Ele é orientado à **precisão**: mede quanto do texto gerado aparece nas traduções de referência, considerando n-gramas de vários tamanhos, normalmente de um a quatro. Inclui também uma penalidade para traduções curtas demais.

Para a prova, guarde a associação: **ROUGE, resumo, revocação**. **BLEU, tradução, precisão**.

E guarde a limitação: as duas medem **sobreposição de palavras**, e não significado. São úteis para comparar versões de um modelo numa tarefa específica, mas não dizem se a resposta é verdadeira ou útil.

## Perplexidade

A **perplexidade** mede o quanto o modelo fica "surpreso" com um texto. Quanto menor, melhor o modelo prevê aquele texto. É muito usada durante o **pré-treinamento**, para acompanhar a evolução do modelo, mas diz pouco sobre a qualidade das respostas numa aplicação real.

## Os benchmarks mais citados

Para comparar modelos de forma mais ampla, existem conjuntos padronizados de tarefas, os **benchmarks**.

O **GLUE**, de 2018, reúne tarefas de entendimento de linguagem, como análise de sentimento e identificação de paráfrases. O **SuperGLUE**, de 2019, é a versão mais difícil, criada quando os modelos começaram a saturar o GLUE.

O **MMLU**, sigla para Massive Multitask Language Understanding, testa conhecimento e raciocínio em **57 matérias**, como matemática, direito, medicina e história, em formato de múltipla escolha. É um dos benchmarks mais citados para LLMs.

O **BIG-bench** reúne **mais de duzentas tarefas** diversas, incluindo raciocínio, conhecimento de senso comum e tarefas criativas.

E o **HELM**, de Stanford, propõe uma avaliação **holística**: além de acurácia, mede **calibração, robustez, justiça, viés, toxicidade e eficiência**, em vários cenários. A palavra-chave é holística: múltiplas métricas além da acurácia.

Duas ressalvas importantes. Primeira: **contaminação de dados**. Se as perguntas do benchmark vazaram para os dados de treino, o modelo vai bem porque decorou, e não porque generaliza. Segunda: **bom resultado em benchmark não garante bom resultado na sua tarefa**. Benchmarks servem para fazer uma primeira seleção de modelos. A decisão final deve vir de uma avaliação com **os seus próprios dados**.

## Avaliação humana e LLM como juiz

A avaliação mais confiável continua sendo a **humana**: especialistas leem as respostas e dão notas segundo critérios claros, como correção, completude, tom e segurança. O problema é custo e tempo.

Por isso se popularizou o **LLM como juiz**, em inglês **LLM-as-a-judge**: um modelo forte recebe a pergunta, a resposta e critérios de avaliação, e dá uma nota ou escolhe a melhor de duas respostas. É rápido e escala. Mas tem vieses conhecidos: tende a preferir **respostas mais longas**, pode favorecer **a primeira opção apresentada**, chamado viés de posição, e pode favorecer respostas do **mesmo modelo ou família**. As boas práticas são usar critérios bem definidos, calibrar o juiz comparando com notas humanas numa amostra, e alternar a ordem das opções.

## O conjunto de avaliação próprio

Na prática profissional, o núcleo da avaliação é um **conjunto de avaliação próprio**, às vezes chamado de **golden dataset**: perguntas reais, com respostas de referência validadas por especialistas, cobrindo os casos comuns, os difíceis e os que devem ser recusados. Toda mudança de prompt, de modelo ou de dados é testada contra esse conjunto, para detectar **regressões**. Isso é o equivalente aos testes automatizados no desenvolvimento de software.

## Pegadinhas de prova

Primeira: usar BLEU para avaliar resumos, ou ROUGE para tradução. Lembre as associações.

Segunda: escolher o modelo de produção só pelo ranking de um benchmark público. O certo é avaliar com os próprios dados.

Terceira: achar que uma nota ROUGE alta garante que o resumo está correto. Ela mede sobreposição de palavras, não veracidade.

## Cenário resolvido

Uma equipe precisa escolher entre três modelos para resumir pareceres jurídicos internos. Um deles lidera um benchmark público famoso. Qual é a abordagem mais adequada para decidir?

Montar um conjunto de pareceres reais com resumos de referência escritos por especialistas, calcular métricas automáticas como ROUGE para uma visão rápida, complementar com LLM como juiz com critérios de fidelidade ao texto, e validar uma amostra com avaliação humana. O ranking público serve só como filtro inicial. Escolher o líder do benchmark sem testar com os próprios dados é a armadilha.

## Resumo em um minuto

Avaliar LLMs é difícil porque respostas diferentes podem estar certas. ROUGE avalia resumos e é orientado à revocação, com as variações 1, 2 e L. BLEU avalia tradução e é orientado à precisão. Ambas medem sobreposição de n-gramas, e não significado. Perplexidade acompanha o pré-treino. GLUE e SuperGLUE medem entendimento, MMLU cobre 57 matérias, BIG-bench mais de duzentas tarefas, e HELM é holístico. Cuidado com contaminação. LLM como juiz escala, mas tem vieses de tamanho e de posição. E o centro de tudo é um conjunto de avaliação próprio, usado para detectar regressões.

## Termos-chave desta aula

- **N-grama**: sequência de n palavras. Unigrama é uma, bigrama são duas.
- **ROUGE**: métrica de resumo, focada em revocação: cobriu o que devia?
- **BLEU**: métrica de tradução, focada em precisão.
- **MMLU**: benchmark de múltipla escolha com 57 matérias.
- **HELM**: avaliação holística, com várias métricas além da acurácia.
- **Contaminação**: quando as perguntas do benchmark vazaram para o treino.
- **LLM como juiz**: um modelo avaliando respostas; cuidado com os vieses de tamanho e de posição.
