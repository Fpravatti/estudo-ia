---
titulo: Pré-treinamento, memória de GPU e leis de escala
resumo: Como o pré-treinamento funciona, quanto de memória um modelo exige, precisão numérica, leis de escala, Chinchilla e quando pré-treinar um modelo próprio.
---
Nesta aula, vamos entender o pré-treinamento do ponto de vista de quem precisa tomar decisões: quanto custa, quanta memória exige, por que modelos de tamanhos diferentes existem, e em que raríssimos casos faz sentido uma empresa pré-treinar o seu próprio modelo.

## O problema

Um modelo começa com bilhões de parâmetros com valores aleatórios. Para chegar a um modelo útil, ele precisa ver trilhões de tokens. Isso esbarra em três limites: dados, computação e memória. Entender esses limites explica muitas escolhas de arquitetura e de produto que caem em prova.

## Como funciona o pré-treinamento

O modelo recebe trechos de texto e faz a tarefa do seu objetivo de treino, que para os LLMs decoder-only é prever o próximo token. A diferença entre a previsão e o token real é medida por uma **função de perda**. O algoritmo de **retropropagação** calcula, para cada parâmetro, em que direção ajustá-lo para reduzir a perda, e um **otimizador**, geralmente o **Adam** ou variações dele, aplica o ajuste. Isso se repete por bilhões de exemplos.

Como o próprio texto fornece a resposta, não é preciso rotular nada à mão. Por isso o pré-treinamento é **autossupervisionado**, e pode usar a escala da internet.

Os dados passam por uma **curadoria pesada**: remoção de duplicatas, filtros de qualidade, remoção de conteúdo tóxico e de dados pessoais, e balanceamento entre fontes como páginas web, livros, artigos científicos e código. Normalmente, só uma pequena fração do texto bruto coletado sobrevive aos filtros. A qualidade dos dados influencia o modelo tanto quanto o tamanho.

## Quanto de memória um modelo exige

Esta conta aparece em provas e no dia a dia. Cada parâmetro é um número guardado com uma certa **precisão**.

Em **ponto flutuante de 32 bits**, ou FP32, cada parâmetro ocupa **4 bytes**. Então um modelo de **1 bilhão de parâmetros** ocupa cerca de **4 gigabytes** só para guardar os pesos.

Mas **treinar** exige muito mais. Além dos pesos, é preciso guardar os **gradientes**, os **estados do otimizador**, que no Adam são dois valores extras por parâmetro, e as **ativações** intermediárias. Na prática, treinar em FP32 exige algo em torno de **seis vezes mais memória** que os pesos sozinhos. Aquele modelo de 1 bilhão de parâmetros precisaria de uns vinte e poucos gigabytes de GPU para treinar. Um modelo de 70 bilhões, centenas de gigabytes, distribuídos por várias GPUs.

## Precisão numérica e quantização

Uma forma de economizar memória é reduzir a precisão.

Em **FP16**, ponto flutuante de 16 bits, cada parâmetro ocupa **2 bytes**, metade do FP32. O problema é que o FP16 tem uma faixa de valores menor, o que pode causar instabilidade no treino.

O **BF16**, ou **bfloat16**, criado pelo Google, também usa 16 bits, mas mantém a **mesma faixa de valores do FP32**, sacrificando precisão nas casas decimais. Por isso se tornou o formato preferido para treinar LLMs.

Em **INT8**, inteiro de 8 bits, cada parâmetro ocupa **1 byte**, um quarto do FP32. E existem formatos de **4 bits**, que ocupam meio byte.

Converter um modelo para uma precisão menor se chama **quantização**. Ela reduz memória e acelera a inferência, com alguma perda de qualidade, geralmente pequena em 8 bits e maior em 4 bits. A quantização é usada principalmente para **executar** modelos de forma mais barata, e também em técnicas de fine-tuning como o QLoRA. Veremos em detalhe no módulo 9.

Conta rápida para memorizar: um modelo de 7 bilhões de parâmetros ocupa cerca de 28 gigabytes em FP32, 14 em BF16, 7 em INT8 e uns 3,5 em 4 bits. Por isso modelos quantizados de 7 bilhões rodam até em computadores pessoais.

## Leis de escala e o Chinchilla

Pesquisadores observaram que o desempenho de um LLM melhora de forma previsível quando se aumenta o **tamanho do modelo**, a **quantidade de dados** e a **computação**. Essas relações se chamam **leis de escala**.

A pergunta prática é: com um orçamento fixo de computação, é melhor um modelo maior com menos dados, ou um modelo menor com mais dados? Em 2022, um estudo da DeepMind, conhecido pelo nome do modelo que produziu, o **Chinchilla**, mostrou que muitos modelos da época eram **grandes demais e treinados com dados de menos**. A proporção ótima encontrada foi de aproximadamente **20 tokens de treino para cada parâmetro**. O Chinchilla, com 70 bilhões de parâmetros e cerca de 1,4 trilhão de tokens, superou modelos quatro vezes maiores.

A lição para a prova: **mais parâmetros não significa automaticamente um modelo melhor**. Dados suficientes e de qualidade importam tanto quanto o tamanho. E hoje muitos modelos são treinados com muito mais do que vinte tokens por parâmetro, porque um modelo menor e muito bem treinado é mais barato de executar em produção, e a inferência acaba custando mais do que o treino ao longo da vida do modelo.

## Quando pré-treinar um modelo próprio

Quase nunca. Pré-treinar do zero só se justifica quando o domínio tem uma **linguagem muito específica**, mal representada nos dados gerais, e a organização tem **muitos dados próprios** e **orçamento grande**. O exemplo clássico é o **BloombergGPT**, de 2023, treinado com uma mistura de dados financeiros proprietários e dados gerais.

Para a imensa maioria dos casos, incluindo bancos, a sequência recomendada é: usar um modelo fundacional pronto com bons prompts, depois RAG para trazer conhecimento próprio, depois fine-tuning para ajustar comportamento. Existe ainda um meio-termo, o **pré-treinamento continuado**, em que se continua o pré-treino de um modelo existente com textos do domínio, mais barato que começar do zero.

## Pegadinhas de prova

Primeira: a alternativa que propõe pré-treinar um modelo do zero porque a empresa "tem documentos internos". Documentos internos são caso de RAG, não de pré-treinamento.

Segunda: achar que o modelo maior sempre vence. O Chinchilla mostrou o contrário com orçamento fixo.

Terceira: confundir BF16 com FP16. Ambos têm 16 bits, mas o BF16 mantém a faixa do FP32, e por isso é mais estável para treinar.

## Cenário resolvido

Uma empresa quer executar um modelo aberto de 13 bilhões de parâmetros numa GPU com 24 gigabytes de memória, apenas para inferência. Em BF16, os pesos ocupariam cerca de 26 gigabytes, e não cabem. O que fazer, mantendo o mesmo modelo?

A resposta é quantizar. Em INT8, os pesos caem para cerca de 13 gigabytes, e em 4 bits para cerca de 6,5, deixando espaço para o KV cache e as ativações. Treinar um modelo novo ou trocar para FP32 é exatamente o contrário do necessário, porque FP32 dobraria a memória.

## Resumo em um minuto

O pré-treinamento é autossupervisionado, depende de curadoria pesada de dados e usa retropropagação com otimizadores como o Adam. Em FP32, cada parâmetro ocupa 4 bytes, e treinar exige cerca de seis vezes a memória dos pesos. BF16 e FP16 usam 2 bytes, com o BF16 mais estável. INT8 usa 1 byte, e 4 bits, meio byte. Quantizar reduz memória e custo de inferência. As leis de escala mostram que desempenho depende de parâmetros, dados e computação, e o Chinchilla indicou cerca de 20 tokens por parâmetro. Pré-treinar do zero raramente se justifica.
