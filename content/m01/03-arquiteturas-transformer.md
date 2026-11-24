---
titulo: As três arquiteturas do Transformer
resumo: Encoder, decoder e encoder-decoder; objetivos de pré-treinamento; qual arquitetura serve para cada tarefa.
---
O Transformer, apresentado em 2017 no artigo "Attention is all you need", é a base de praticamente todos os LLMs. Mas existem três formas de montar um Transformer, e cada uma é boa em coisas diferentes. Escolher a arquitetura certa para a tarefa é uma questão clássica de prova, e é o assunto desta aula. O funcionamento interno da atenção fica para o módulo 2. Aqui, vamos ver a visão de arquitetura.

## O problema

Antes do Transformer, os modelos de linguagem usavam **redes recorrentes**, que processavam o texto palavra por palavra, em sequência. Isso tinha dois problemas. Era lento, porque não dava para paralelizar o processamento. E o modelo "esquecia" o começo de textos longos.

O Transformer resolveu os dois com o mecanismo de **autoatenção**, ou **self-attention**: cada token olha diretamente para todos os outros tokens da sequência e calcula o quanto cada um é relevante para entendê-lo. Isso permite processar a sequência inteira em paralelo nas GPUs, e captura relações entre palavras distantes.

## As duas metades do Transformer original

O Transformer original tinha duas partes, porque foi criado para tradução.

O **encoder**, ou codificador, lê a frase de entrada inteira e produz uma representação rica de cada token, levando em conta o contexto dos dois lados, antes e depois. Dizemos que a atenção dele é **bidirecional**.

O **decoder**, ou decodificador, gera a saída um token por vez. A atenção dele é **causal**, ou mascarada: cada token só pode olhar para os tokens anteriores, nunca para os futuros. Faz sentido: na hora de gerar, o futuro ainda não existe.

Desse desenho surgiram três famílias de modelos.

## Família 1: só encoder

Os modelos **encoder-only**, como o **BERT** e seus derivados, usam só a parte do codificador. Eles são pré-treinados com o objetivo de **modelagem de linguagem mascarada**, em inglês **masked language modeling**: alguns tokens da frase são escondidos, e o modelo aprende a adivinhá-los usando o contexto dos dois lados.

Como resultado, eles produzem ótimas representações do texto, mas **não são feitos para gerar texto longo**. São excelentes para tarefas de **entendimento**: classificação de sentimento, classificação de documentos, reconhecimento de entidades nomeadas, como nomes de pessoas, empresas e valores, e principalmente para gerar **embeddings**, os vetores numéricos que representam o significado de um texto e que são a base da busca semântica e do RAG.

São modelos relativamente pequenos e baratos de executar, o que os torna muito usados em produção para classificação em grande volume.

## Família 2: só decoder

Os modelos **decoder-only**, como as famílias **GPT**, **Llama**, **Claude** e a maioria dos LLMs atuais, usam só a parte do decodificador. São pré-treinados com **modelagem de linguagem causal**: prever o próximo token, olhando só para trás.

Eles são feitos para **geração**: conversar, escrever, resumir, responder perguntas, gerar código. E, com escala suficiente, mostraram que conseguem fazer também as tarefas de entendimento, só com instruções no prompt. É por isso que dominam hoje.

## Família 3: encoder-decoder

Os modelos **encoder-decoder**, também chamados de **sequence to sequence**, como o **T5** e o **BART**, mantêm as duas partes. O encoder lê a entrada inteira, e o decoder gera a saída consultando essa leitura.

O T5 foi pré-treinado com um objetivo chamado **corrupção de trechos**, em inglês **span corruption**: trechos inteiros do texto são substituídos por marcadores, e o modelo aprende a gerar os trechos que faltam.

Essa arquitetura é naturalmente boa para tarefas que **transformam uma sequência de entrada em outra sequência**: **tradução**, **sumarização** e reescrita. O FLAN-T5, uma versão do T5 ajustada com instruções, é muito usado em cursos e em aplicações menores.

## A tabela mental

Vale guardar como uma tabela de três linhas.

- Encoder-only, como o BERT: objetivo de tokens mascarados, atenção bidirecional, bom para classificação, entidades e embeddings.
- Decoder-only, como GPT e Llama: objetivo de próximo token, atenção causal, bom para geração e uso geral.
- Encoder-decoder, como T5 e BART: objetivo de reconstruir trechos, bom para tradução e sumarização.

## Embeddings: a ponte para o resto do curso

Vale aprofundar um conceito que aparece em quase todos os módulos. Dentro do Transformer, cada token é representado por um **vetor**, uma lista de centenas ou milhares de números. Esse vetor se chama **embedding**.

A propriedade mágica dos embeddings é que **textos com significado parecido ficam próximos** nesse espaço de vetores, mesmo usando palavras diferentes. "Quero cancelar meu cartão" e "como encerro minha conta do cartão" geram vetores próximos. A proximidade é medida geralmente pela **similaridade de cosseno**.

Modelos de embedding especializados, geralmente da família encoder, transformam frases e documentos inteiros em um vetor. Esses vetores são guardados em **bancos de dados vetoriais** e permitem a **busca semântica**: buscar por significado, e não por palavras exatas. É a base do RAG, assunto do módulo 5.

## Pegadinhas de prova

Primeira: escolher um LLM gigante, decoder-only, para classificação de sentimento em altíssimo volume com orçamento apertado. Muitas vezes, um modelo encoder pequeno e ajustado é a resposta mais eficiente.

Segunda: dizer que o BERT é um bom modelo para gerar textos longos. Não é. Ele é bidirecional e foi feito para entendimento.

Terceira: confundir atenção bidirecional com causal. Bidirecional olha para os dois lados, e é do encoder. Causal olha só para trás, e é do decoder.

## Cenário resolvido

Uma equipe precisa de três componentes: um classificador que rotula milhões de mensagens por dia em dez categorias, com baixo custo; um gerador de vetores para indexar documentos e permitir busca semântica; e um assistente que redige respostas personalizadas aos clientes. Qual combinação de arquiteturas é a mais adequada?

Para classificar milhões de mensagens com baixo custo, um modelo encoder ajustado para classificação. Para gerar vetores de busca semântica, um modelo de embeddings, também tipicamente da família encoder. Para redigir respostas, um modelo decoder-only. A alternativa que propõe um único LLM gigante para tudo funciona tecnicamente, mas não é a mais eficiente em custo e latência, e numa prova profissional a palavra "melhor" quase sempre inclui custo.

## Resumo em um minuto

O Transformer substituiu as redes recorrentes com a autoatenção, que processa a sequência em paralelo e captura relações distantes. Encoder-only, como o BERT, usa atenção bidirecional e tokens mascarados, e é ótimo para classificação e embeddings. Decoder-only, como GPT e Llama, usa atenção causal e previsão do próximo token, e domina a geração. Encoder-decoder, como T5 e BART, é natural para tradução e sumarização. Embeddings representam significado como vetores, e textos parecidos ficam próximos, o que sustenta a busca semântica.
