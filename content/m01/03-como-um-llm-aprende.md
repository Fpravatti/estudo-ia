---
titulo: Como um LLM aprende: pré-treinamento, ajuste fino e feedback humano
resumo: As fases de treinamento de um LLM, o que é modelo base, fine-tuning, RLHF e por que os modelos erram.
---
Na aula passada, vimos que um LLM prevê o próximo token. Mas como ele chega a ser aquele assistente educado, que responde perguntas e segue instruções? Nesta aula, vamos acompanhar a formação de um LLM, do começo ao fim. E vou usar uma comparação que ajuda bastante: a formação de um profissional.

## Fase 1: o pré-treinamento, ou a grande leitura

Imagine uma pessoa que, antes de começar a trabalhar, lê uma biblioteca inteira. Livros, enciclopédias, sites, fóruns, manuais, código de programação. Ela não está estudando para uma tarefa específica. Ela está só absorvendo como a língua funciona e como o mundo é descrito em texto.

Essa é a primeira fase de um LLM, chamada **pré-treinamento**. O modelo recebe uma quantidade enorme de texto e pratica uma única tarefa, bilhões de vezes: prever o próximo token. A cada erro, os parâmetros são ajustados um pouquinho.

Um detalhe importante: o pré-treinamento não precisa de dados rotulados por pessoas. O próprio texto já traz a resposta certa, porque a próxima palavra está ali, escrita. Por isso dizemos que é um aprendizado **autossupervisionado**. É isso que permite usar quantidades tão gigantescas de dados.

O pré-treinamento é a fase mais cara de todas. Ele exige milhares de GPUs funcionando por semanas ou meses, e pode custar dezenas ou centenas de milhões de dólares. Por isso, poucas empresas no mundo fazem isso. A maioria das empresas, e a maioria dos engenheiros de IA, usa modelos que outros já pré-treinaram.

## O resultado: o modelo base

Ao final do pré-treinamento, temos o que se chama de **modelo base**, ou modelo fundacional. Ele sabe muito sobre a língua e sobre o mundo. Mas ainda não é um bom assistente.

Veja um exemplo curioso. Se você escrever para um modelo base "qual é a capital da França?", ele pode responder com "qual é a capital da Alemanha? Qual é a capital da Itália?". Por quê? Porque ele aprendeu a continuar textos. E, na internet, uma pergunta assim aparece muitas vezes dentro de listas de exercícios. Então ele continua a lista, em vez de responder.

Ou seja: o modelo base tem conhecimento, mas ainda não aprendeu a seguir instruções.

## Fase 2: o ajuste fino com instruções

Voltando à nossa pessoa que leu a biblioteca inteira: agora ela faz um estágio. Alguém mostra para ela milhares de exemplos de pedidos e de boas respostas. "Quando te pedirem um resumo, é assim que se faz. Quando te fizerem uma pergunta, você responde de forma direta."

Essa é a segunda fase, chamada **ajuste fino**, ou em inglês **fine-tuning**. Neste caso específico, é o ajuste fino com instruções, também chamado de ajuste fino supervisionado. O modelo é treinado com um conjunto bem menor de exemplos, desta vez preparados com cuidado, no formato pergunta e resposta ideal. Aqui, sim, entram dados rotulados.

Depois dessa fase, o modelo aprende a se comportar como um assistente: entende que uma pergunta pede uma resposta, que um pedido de resumo pede um resumo, e assim por diante.

## Fase 3: o feedback humano, ou RLHF

Ainda falta um passo. Imagine que agora a pessoa recebe feedback do chefe. Ela escreve duas versões de uma resposta, e o chefe diz qual ficou melhor. Com o tempo, ela aprende o que é considerado uma boa resposta.

Essa é a terceira fase, chamada **RLHF**, sigla em inglês para **aprendizado por reforço com feedback humano**. Funciona assim: o modelo gera várias respostas para a mesma pergunta, e pessoas avaliam qual delas é a melhor. Com essas avaliações, o modelo é ajustado para dar mais respostas parecidas com as preferidas pelas pessoas.

O objetivo é deixar o modelo mais alinhado com o que as pessoas esperam. Um jeito comum de resumir esse objetivo são três palavras em inglês que começam com H: **helpful, honest e harmless**. Ou seja: útil, honesto e inofensivo. Útil, porque ajuda de verdade. Honesto, porque não engana. E inofensivo, porque evita causar danos, como ensinar a fazer algo perigoso.

As fases 2 e 3 juntas costumam ser chamadas de **pós-treinamento**. Existem outras técnicas além do RLHF, com nomes como DPO, mas a ideia geral é a mesma: ensinar o modelo a preferir as respostas que consideramos boas. Também é com técnicas de reforço que se treinam os modelos de raciocínio, que pensam passo a passo antes de responder. Vamos ver isso no módulo 2.

## Fine-tuning nas empresas

Uma confusão comum: o fine-tuning não é feito só pelos criadores do modelo. Uma empresa também pode pegar um modelo já pronto e fazer o seu próprio ajuste fino, com os seus próprios dados.

Por exemplo, uma empresa pode ajustar um modelo para escrever sempre no tom de voz da marca, ou para executar muito bem uma tarefa específica, como classificar reclamações de clientes em categorias internas. Isso é muito mais barato do que pré-treinar um modelo do zero, porque usa bem menos dados e computação.

Existem até técnicas que tornam esse ajuste ainda mais barato, chamadas de **ajuste fino eficiente em parâmetros**, ou **PEFT**. Em vez de mexer em todos os bilhões de parâmetros, elas mexem só numa pequena parte, ou adicionam algumas peças extras pequenas. A técnica mais famosa desse grupo se chama **LoRA**. Por enquanto, basta saber que ela existe. Vamos estudar o treinamento em detalhe no módulo 9.

## Tamanho importa, mas não é tudo

Modelos maiores, com mais parâmetros e treinados com mais dados, geralmente sabem mais e raciocinam melhor. Os pesquisadores observaram até um padrão chamado **leis de escala**: o desempenho melhora de forma previsível quando aumentamos o tamanho do modelo, a quantidade de dados e a computação.

Mas modelos maiores também são mais caros e mais lentos. Para muitas tarefas simples, como classificar o assunto de um e-mail, um modelo pequeno dá conta muito bem, e custa uma fração do preço. Escolher o tamanho certo do modelo para cada tarefa é uma das decisões do engenheiro de IA.

## Por que o modelo às vezes erra

Agora você já consegue entender por que um LLM às vezes inventa coisas. Ele aprendeu **padrões de linguagem**, e não um banco de fatos conferidos. Quando ele não sabe uma resposta, o mecanismo de prever o próximo token continua funcionando e produz algo que **soa** plausível, mesmo que seja falso.

É como aquela pessoa que leu muito, mas não guardou tudo com precisão, e, na dúvida, responde com confiança em vez de dizer "não sei". Esse fenômeno tem nome: **alucinação**. É um dos temas da próxima aula.

## Resumo em um minuto

Um LLM é formado em fases. No pré-treinamento, ele lê uma quantidade enorme de texto e aprende a prever o próximo token, sem precisar de rótulos humanos. É a fase mais cara, e gera o modelo base, que sabe muito, mas não segue instruções. No ajuste fino com instruções, ele aprende com exemplos de pedidos e boas respostas. No RLHF, ele aprende com avaliações humanas sobre quais respostas são melhores, para ser útil, honesto e inofensivo. Empresas também podem fazer seu próprio fine-tuning, inclusive com técnicas eficientes como LoRA. E como o modelo aprende padrões e não fatos verificados, ele pode alucinar.

## Para a prova, lembre

- Pré-treinamento: muito texto, prever o próximo token, autossupervisionado, caríssimo.
- Modelo base completa textos, mas não segue bem instruções.
- Ajuste fino com instruções ensina o modelo a agir como assistente, com exemplos de pergunta e resposta.
- RLHF é o aprendizado por reforço com feedback humano: pessoas avaliam respostas e o modelo aprende as preferências.
- Pós-treinamento é o nome do conjunto: ajuste fino e alinhamento com preferências.
- PEFT e LoRA fazem fine-tuning mexendo em poucos parâmetros, por isso são mais baratos.
- Alucinação: o modelo gera algo que parece certo, mas é falso.
