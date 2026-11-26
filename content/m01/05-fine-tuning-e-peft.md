---
titulo: Fine-tuning com instruções e PEFT
resumo: Ajuste fino com instruções, tarefa única e multitarefa, esquecimento catastrófico, LoRA, QLoRA, soft prompts e quando ajustar um modelo.
---
Nesta aula, vamos ver como adaptar um modelo pronto para uma tarefa ou um comportamento específico, mudando os seus parâmetros. É o **fine-tuning**, ou ajuste fino. E vamos ver as técnicas que tornaram isso barato, o **PEFT**. Saber quando fazer fine-tuning, e principalmente quando não fazer, é um dos pontos mais cobrados.

## O problema

Prompts resolvem muita coisa, mas têm limites. Exemplos dentro do prompt ocupam a janela de contexto e custam tokens em toda chamada. Modelos pequenos às vezes não aprendem bem só com exemplos no prompt. E certos comportamentos, como seguir um formato muito rígido ou adotar um estilo específico, são difíceis de garantir só com instruções.

O fine-tuning resolve isso ensinando o comportamento diretamente nos pesos do modelo.

## Aprendizado em contexto versus fine-tuning

Primeiro, uma distinção essencial. Quando colocamos exemplos no prompt, o modelo aprende o padrão naquela chamada, sem mudar nenhum parâmetro. Isso é **aprendizado em contexto**, com as variações **zero-shot**, sem exemplos, **one-shot**, com um, e **few-shot**, com alguns. Quando fazemos **fine-tuning**, os parâmetros mudam de forma permanente.

Regra de bolso: se o few-shot já resolve com qualidade e custo aceitáveis, não há motivo para fine-tuning. Se mesmo com cinco ou seis exemplos no prompt o modelo não acerta, é hora de considerar o ajuste fino.

## Fine-tuning com instruções

O tipo mais comum é o **fine-tuning com instruções**, também chamado de **fine-tuning supervisionado**, ou **SFT**. O conjunto de dados é formado por pares de **instrução e resposta ideal**, às vezes com um contexto de entrada. Por exemplo: "Classifique o assunto desta reclamação", seguida da reclamação, e da resposta "Tarifas".

Uma prática comum é usar **modelos de prompt**, ou templates, para converter bases de dados existentes nesse formato de instrução. Depois, os dados são divididos em **treino, validação e teste**, como em qualquer projeto de machine learning.

Quanto de dados é preciso? Bem menos que no pré-treinamento. Para uma **tarefa única**, algumas centenas a alguns milhares de bons exemplos, algo na faixa de **500 a 1000**, já costumam trazer ganhos grandes. A **qualidade** dos exemplos importa mais do que a quantidade.

## Esquecimento catastrófico

Aqui está um conceito que cai muito. Quando você ajusta o modelo intensamente para uma única tarefa, ele pode ficar ótimo nela e **piorar em outras** que fazia bem antes. Isso se chama **esquecimento catastrófico**, em inglês **catastrophic forgetting**.

Se você só precisa daquela tarefa, isso pode não ser um problema. Se precisa que o modelo continue bom em tudo, existem duas saídas. A primeira é o **fine-tuning multitarefa**: treinar com exemplos de várias tarefas ao mesmo tempo, o que exige mais dados, geralmente dezenas de milhares de exemplos. O exemplo famoso é a família **FLAN**, cujo FLAN-T5 foi ajustado com mais de mil e oitocentas tarefas. A segunda saída é usar **PEFT**, que preserva os pesos originais.

## PEFT: ajuste fino eficiente em parâmetros

No **fine-tuning completo**, todos os bilhões de parâmetros são atualizados. Isso exige a mesma memória pesada do treino, aquela de cerca de seis vezes os pesos, e gera uma cópia inteira do modelo para cada tarefa.

O **PEFT**, sigla em inglês para **ajuste fino eficiente em parâmetros**, **congela** a maior parte do modelo original e treina só um número pequeno de parâmetros. As vantagens: muito menos memória, treino mais rápido, menos risco de esquecimento catastrófico, e arquivos pequenos para cada tarefa, que podem ser trocados sobre o mesmo modelo base.

## LoRA

A técnica de PEFT mais usada é o **LoRA**, sigla para **Low-Rank Adaptation**, adaptação de baixo posto.

A ideia: em vez de alterar uma grande matriz de pesos do modelo, o LoRA mantém a matriz original congelada e treina **duas matrizes pequenas**, cujo produto tem o mesmo formato da original. O tamanho dessas matrizes é controlado por um número chamado **posto**, em inglês **rank**, normalmente entre 4 e 64. Como são pequenas, o número de parâmetros treináveis cai drasticamente, muitas vezes para **menos de um por cento** do total. E a qualidade costuma ficar próxima do fine-tuning completo.

Duas propriedades importantes. Na inferência, as matrizes do LoRA podem ser **somadas aos pesos originais**, e aí não há latência extra. E como cada adaptador é pequeno, é possível manter **um adaptador por tarefa** e trocar conforme a necessidade, usando o mesmo modelo base na memória.

## QLoRA e soft prompts

O **QLoRA** combina **quantização** com LoRA. O modelo base é carregado **quantizado em 4 bits**, o que reduz muito a memória, e os adaptadores LoRA são treinados por cima. Isso permitiu ajustar modelos com dezenas de bilhões de parâmetros numa única GPU.

Outra família de PEFT são os **soft prompts**, ou **prompt tuning**. Em vez de mexer nos pesos, treinam-se alguns **vetores de embedding virtuais** que são adicionados no início da entrada. Eles funcionam como um prompt aprendido, que não corresponde a palavras reais. É uma técnica ainda mais leve, que funciona melhor em modelos grandes.

## Quando fazer fine-tuning

Faça fine-tuning quando o objetivo é **mudar comportamento**: seguir um formato com consistência, adotar o tom de voz da marca, dominar uma tarefa específica, ou permitir que um **modelo menor e mais barato** alcance a qualidade de um maior naquela tarefa.

Não faça fine-tuning para **ensinar conhecimento que muda**, como preços, tarifas e regulamentos. Para isso, a resposta é **RAG**. O fine-tuning grava padrões nos pesos, e atualizar esse conhecimento exigiria treinar de novo a cada mudança. Além disso, o modelo ajustado não cita fontes, e pode continuar alucinando.

## Pegadinhas de prova

Primeira: usar fine-tuning para manter o modelo atualizado com documentos que mudam toda semana. A resposta é RAG.

Segunda: achar que o LoRA adiciona latência obrigatória. As matrizes podem ser mescladas aos pesos.

Terceira: confundir soft prompt com prompt engineering. Soft prompt é treinado, são vetores, e não texto escrito por uma pessoa.

## Cenário resolvido

Uma empresa usa um modelo grande e caro para extrair dez campos de formulários padronizados. A qualidade é boa, mas o custo por documento é alto e o volume vai triplicar. Ela tem oito mil formulários já extraídos e revisados por pessoas. Qual é a melhor estratégia?

Há dados rotulados de qualidade, a tarefa é estável e específica, e o problema é custo. Então: fazer fine-tuning de um modelo menor, de preferência com LoRA, usando os formulários revisados, e avaliar se ele alcança a qualidade do modelo grande. Se alcançar, o custo por documento cai bastante. RAG não ajudaria, porque o problema não é falta de conhecimento. E pré-treinar um modelo seria desproporcional.

## Resumo em um minuto

Aprendizado em contexto não muda parâmetros, e fine-tuning muda. O fine-tuning com instruções usa pares de instrução e resposta, e para uma tarefa única algumas centenas a mil exemplos já ajudam muito. Ajustar só uma tarefa pode causar esquecimento catastrófico, que se evita com fine-tuning multitarefa ou com PEFT. O LoRA congela o modelo e treina matrizes de baixo posto, com menos de um por cento dos parâmetros, e pode ser mesclado sem latência. O QLoRA soma quantização em 4 bits. Soft prompts treinam vetores virtuais. Fine-tuning muda comportamento, RAG traz conhecimento.

## Termos-chave desta aula

- **Fine-tuning**: treinar um modelo pronto com exemplos para mudar o comportamento dele.
- **SFT**: fine-tuning supervisionado, com pares de instrução e resposta.
- **Esquecimento catastrófico**: o modelo piora em tarefas antigas depois de ajustado numa só.
- **PEFT**: congela o modelo e treina poucos parâmetros.
- **LoRA**: treina duas matrizes pequenas por camada; pode ser mesclado sem deixar o modelo mais lento.
- **QLoRA**: LoRA em cima de um modelo base quantizado em 4 bits.
- **Soft prompt**: vetores treinados colocados no início da entrada, no lugar de palavras.
