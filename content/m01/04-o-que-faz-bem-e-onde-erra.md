---
titulo: O que a IA generativa faz bem e onde ela erra
resumo: As tarefas de escrever, ler e conversar; e as limitações: alucinação, data de corte, contexto, contas, vieses.
---
Já sabemos o que é um LLM e como ele aprende. Agora vem a pergunta prática: para que ele serve de verdade? E onde não dá para confiar nele? Saber responder essas duas perguntas é uma das habilidades mais importantes de um engenheiro de IA.

## Três grandes tipos de tarefa: escrever, ler e conversar

Uma forma bem útil de organizar o que os LLMs fazem bem é dividir em três grupos: tarefas de **escrever**, tarefas de **ler** e tarefas de **conversar**.

Nas tarefas de **escrever**, o modelo produz um texto a partir de um pedido curto. Exemplos: escrever o rascunho de um e-mail, criar ideias num brainstorm, sugerir nomes para um produto, traduzir um texto, ou reescrever algo num tom mais formal. Aqui o texto de saída costuma ser maior que o pedido.

Nas tarefas de **ler**, acontece o contrário. O modelo recebe um texto grande e devolve algo menor. Exemplos: resumir um documento longo, extrair informações de um contrato, como datas e valores, ou classificar mensagens. Imagine um banco que recebe milhares de reclamações por dia. Um LLM pode ler cada uma e dizer: esta é sobre cartão, esta é sobre tarifa, esta está muito irritada e precisa de atenção urgente. Esse tipo de tarefa, de entender o sentimento de um texto, se chama **análise de sentimento**.

Nas tarefas de **conversar**, o modelo mantém um diálogo. O exemplo mais comum são os assistentes virtuais de atendimento, que conversam com o cliente, tiram dúvidas e, quando necessário, passam a conversa para um atendente humano.

## Duas formas de usar: na tela ou dentro de um sistema

Existem duas formas principais de usar um LLM.

A primeira é a forma que você talvez já conheça: abrir um aplicativo como o ChatGPT, o Gemini ou o Claude, digitar e ler a resposta. É ótimo para tarefas do dia a dia de uma pessoa.

A segunda forma é a que mais interessa a um engenheiro de IA: colocar o LLM **dentro de um sistema**. Nesse caso, um programa conversa com o modelo de forma automática, por meio de uma **API**. API é uma porta de comunicação entre programas. O sistema do banco, por exemplo, envia cada reclamação para o modelo pela API, recebe a classificação de volta, e já encaminha para a equipe certa. Ninguém precisa digitar nada.

## Um teste rápido: o recém-formado

Como saber se uma tarefa é boa candidata para um LLM? Existe um teste mental bem útil.

Pergunte a si mesmo: **uma pessoa recém-formada, inteligente, conseguiria fazer essa tarefa só com as instruções que eu vou escrever, sem nenhum treinamento extra?** Se a resposta for sim, provavelmente um LLM também consegue. Por exemplo, "leia esta reclamação e diga se é sobre cartão ou sobre conta" passa no teste. Já "decida se vamos aprovar este empréstimo de um milhão de reais" não passa. Essa decisão exige conhecimento específico da empresa, dados que não estão no texto, e responsabilidade que não deve ficar só com uma máquina.

## As limitações: onde o modelo erra

Agora, a parte que mais cai em prova: as limitações dos LLMs. Vamos passar por seis.

**Primeira: alucinação.** O modelo pode inventar informações com total confiança. Um caso real ficou famoso em 2023, nos Estados Unidos: advogados usaram um chatbot para pesquisar processos antigos e apresentaram ao juiz casos que simplesmente não existiam. O modelo tinha inventado tudo, com nomes e números que pareciam reais. A lição: para qualquer informação importante, confira em uma fonte confiável.

**Segunda: data de corte de conhecimento.** O modelo não sabe o que aconteceu depois do fim do seu treinamento. Se você perguntar a cotação do dólar de hoje, ele não sabe, a não ser que receba essa informação ou use uma ferramenta de busca.

**Terceira: janela de contexto limitada.** Existe um limite de quanto texto o modelo consegue considerar de uma vez. Os modelos atuais aceitam textos bem longos, mas o limite existe. E mesmo dentro do limite, informações no meio de um texto muito longo às vezes recebem menos atenção.

**Quarta: contas e dados estruturados.** LLMs não são calculadoras. Como eles geram texto token por token, podem errar contas, especialmente com números grandes. Também não são a melhor ferramenta para analisar planilhas enormes. Para isso, o ideal é o modelo usar uma ferramenta, como uma calculadora ou um programa, e não fazer a conta "de cabeça".

**Quinta: vieses.** O modelo aprende com textos escritos por pessoas, e esses textos carregam preconceitos da sociedade. Então, o modelo pode reproduzir estereótipos, por exemplo associando certas profissões a um gênero. Isso é especialmente grave em decisões que afetam pessoas, como análise de crédito ou seleção de currículos.

**Sexta: conteúdo inadequado e segurança.** Um modelo pode ser induzido a gerar conteúdo tóxico, perigoso ou a revelar informações que não deveria. O treinamento com feedback humano ajuda a reduzir isso, mas não elimina totalmente. Existem até ataques específicos, em que alguém escreve instruções maliciosas para enganar o modelo. Esse tipo de ataque se chama **prompt injection**, e vamos estudar no módulo de segurança.

## Como contornar as limitações

A boa notícia é que existem técnicas para contornar quase todas essas limitações. E muitas delas são justamente os próximos módulos da sua trilha.

Para alucinação e data de corte, uma técnica muito usada é dar ao modelo os documentos certos junto com a pergunta, para ele responder com base neles. Essa técnica se chama **RAG**, e é o módulo 5. Para contas e informações em tempo real, damos **ferramentas** ao modelo, como uma calculadora ou uma busca, e isso leva aos **agentes**, no módulo 6. Para vieses e segurança, usamos avaliações, filtros e proteções, os chamados **guardrails**, nos módulos 8 e 10.

E, em decisões importantes, existe uma prática essencial: manter um **humano no circuito**, ou em inglês **human in the loop**. A IA sugere, e uma pessoa revisa e decide.

## Resumo em um minuto

LLMs são bons em três grupos de tarefas: escrever, ler e conversar. Eles podem ser usados numa tela de chat ou dentro de sistemas, por meio de uma API. Um bom teste é perguntar se um recém-formado faria a tarefa só com as instruções. As principais limitações são: alucinação, data de corte, janela de contexto limitada, dificuldade com contas e dados estruturados, vieses e riscos de segurança. E elas podem ser reduzidas com RAG, ferramentas, guardrails e revisão humana.

## Para a prova, lembre

- Escrever, ler e conversar: os três grandes tipos de tarefa de um LLM.
- Resumir, extrair dados e classificar sentimento são tarefas de leitura.
- API é a forma de um sistema usar o modelo de forma automática.
- Alucinação é gerar informação falsa com aparência de verdadeira.
- LLMs não são confiáveis para contas exatas; o ideal é usar uma ferramenta.
- Vieses nos dados de treinamento podem gerar respostas injustas.
- Human in the loop: uma pessoa revisa as decisões importantes.
