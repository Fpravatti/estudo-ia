---
titulo: O que é um LLM e como ele gera texto
resumo: Prever a próxima palavra, tokens, parâmetros, temperatura, janela de contexto e data de corte.
---
Na aula passada, vimos que a IA generativa cria conteúdo novo, e que os modelos que geram texto se chamam LLMs. Agora vamos abrir essa caixa e entender, de um jeito simples, o que é um LLM e como ele consegue escrever.

## O nome: modelo de linguagem grande

LLM é a sigla em inglês para **Large Language Model**, ou seja, **modelo de linguagem grande**.

"Modelo" é o programa que aprendeu alguma coisa a partir de dados. "De linguagem" porque ele trabalha com texto, com a nossa língua. E "grande" porque ele é enorme, em dois sentidos que vamos ver daqui a pouco: ele aprendeu com uma quantidade gigantesca de texto, e ele tem bilhões de peças internas ajustáveis.

Exemplos de LLMs que você provavelmente já ouviu falar: o GPT, da OpenAI, que está por trás do ChatGPT. O Claude, da Anthropic. O Gemini, do Google. E o Llama, da Meta. Existem muitos outros.

## A grande ideia: prever a próxima palavra

Aqui está o segredo mais importante desta aula. Um LLM, no fundo, faz uma coisa só: ele **prevê qual é a próxima palavra** de um texto.

Se eu digo "o céu está...", você provavelmente completa com "azul". Se eu digo "feliz aniversário, muitos anos de...", você completa com "vida". Você faz isso porque já ouviu essas frases muitas vezes. O LLM faz a mesma coisa, só que aprendeu com uma quantidade de texto que nenhum ser humano conseguiria ler em mil vidas.

Sabe o corretor do celular, que sugere a próxima palavra enquanto você digita? Um LLM é como esse corretor, só que turbinado a um nível impressionante.

E como ele escreve um texto inteiro, se só prevê uma palavra? Ele faz isso em repetição. Ele prevê uma palavra, coloca essa palavra no final do texto, e aí prevê a próxima, olhando para tudo o que já foi escrito. Depois a próxima, e a próxima. É por isso que, no ChatGPT, a resposta vai aparecendo aos poucos na tela. Esse jeito de gerar, um pedaço de cada vez, usando o que já foi gerado, tem um nome técnico: geração **autorregressiva**.

## Tokens: os pedacinhos de texto

Eu falei "próxima palavra" para simplificar, mas, na verdade, o modelo trabalha com **tokens**. Um token é um pedaço de texto. Pode ser uma palavra inteira, um pedaço de palavra, ou até um sinal de pontuação.

Por exemplo, uma palavra comum e curta pode ser um token só. Já uma palavra longa ou rara costuma ser quebrada em dois ou três tokens. Em inglês, um token equivale, em média, a uns três quartos de uma palavra. Em português, o mesmo texto costuma gastar um pouco mais de tokens.

Por que isso importa? Por dois motivos práticos. Primeiro, o **custo**: quando uma empresa usa um LLM pago, ela paga por quantidade de tokens. Segundo, o **limite**: todo modelo tem um limite de quantos tokens consegue processar de uma vez. Guarde a palavra token, porque ela vai aparecer em quase todos os módulos.

## Por que "grande": dados e parâmetros

Lembra que o modelo é grande em dois sentidos? O primeiro é a quantidade de **dados de treinamento**. Os LLMs modernos aprendem com trilhões de tokens: páginas da internet, livros, artigos, código de programação.

O segundo sentido são os **parâmetros**. Parâmetros são os números internos do modelo que vão sendo ajustados durante o treinamento. Pense neles como milhões de pequenos botões de volume. No começo, os botões estão em posições aleatórias, e o modelo só fala besteira. Durante o treinamento, cada vez que o modelo erra a próxima palavra, os botões são girados um pouquinho na direção certa. Depois de bilhões de ajustes, os botões ficam numa posição em que o modelo acerta muito bem. Os LLMs atuais têm de alguns bilhões até centenas de bilhões de parâmetros, ou mais.

## O motor por trás: o Transformer

Quase todos os LLMs modernos usam um tipo de rede neural chamado **Transformer**. Ele foi apresentado por pesquisadores do Google em 2017, num artigo famoso chamado "Attention is all you need", que significa "atenção é tudo de que você precisa". A propósito, o "T" de GPT vem de Transformer.

A grande sacada do Transformer é o **mecanismo de atenção**. Ele permite que o modelo, ao processar cada palavra, olhe para todas as outras palavras do texto e decida quais são importantes para entender o sentido.

Um exemplo. Na frase "sentei no banco da praça", a palavra "banco" é um assento. Na frase "abri uma conta no banco", é uma instituição financeira. O mecanismo de atenção faz o modelo olhar para "praça" ou para "conta" e entender qual dos dois sentidos é o certo. Vamos estudar isso com calma no módulo 2.

## Probabilidade e temperatura

Quando o modelo vai escolher o próximo token, ele não tem uma resposta única. Ele calcula uma **probabilidade** para cada token possível. Depois de "o céu está", talvez "azul" tenha uma chance alta, "nublado" uma chance média, e "verde" uma chance bem baixa.

A partir dessas probabilidades, o modelo sorteia o próximo token, com um pouco de aleatoriedade. E existe um ajuste que controla essa aleatoriedade: a **temperatura**.

Com **temperatura baixa**, o modelo quase sempre escolhe as opções mais prováveis. As respostas ficam mais previsíveis, mais consistentes e mais repetitivas. É bom para tarefas que pedem precisão, como extrair dados de um documento. Com **temperatura alta**, o modelo arrisca mais e escolhe opções menos prováveis. As respostas ficam mais variadas e criativas, mas também com mais chance de sair do rumo. É bom para brainstorm ou textos criativos.

Existem ainda outros dois ajustes parecidos, chamados **top-k** e **top-p**. Eles limitam o sorteio às opções mais prováveis. O top-k diz: só sorteie entre as k opções mais prováveis, por exemplo as cinco melhores. O top-p diz: só sorteie entre as opções que, somadas, chegam a uma certa probabilidade. Não se preocupe com os detalhes agora. Basta lembrar que temperatura, top-k e top-p controlam o quanto a resposta é previsível ou criativa.

É por causa desse sorteio que, se você fizer a mesma pergunta duas vezes ao ChatGPT, pode receber respostas diferentes.

## Janela de contexto e data de corte

Mais dois conceitos importantes.

A **janela de contexto** é a quantidade máxima de texto que o modelo consegue considerar de uma vez, contando a sua pergunta, todo o histórico da conversa e a resposta que ele está gerando. Ela é medida em tokens. É como a memória de trabalho do modelo: o que não cabe na janela, ele simplesmente não vê.

A **data de corte de conhecimento** é a data em que terminaram os dados de treinamento do modelo. O modelo só conhece o mundo até ali. Se você perguntar sobre algo que aconteceu depois, ele não vai saber, a não ser que alguém dê essa informação para ele junto com a pergunta, ou que ele tenha acesso a uma ferramenta de busca. Isso acontece porque um LLM, sozinho, não consulta a internet. Ele gera respostas a partir do que aprendeu no treinamento.

## Resumo em um minuto

LLM significa modelo de linguagem grande. Ele funciona prevendo o próximo token, várias vezes seguidas, num processo chamado autorregressivo. Tokens são pedaços de texto, e definem custo e limites. O modelo é grande porque aprendeu com trilhões de tokens e tem bilhões de parâmetros, que são os botões ajustados no treino. A arquitetura por trás é o Transformer, com seu mecanismo de atenção. A temperatura controla o quanto as respostas são previsíveis ou criativas. A janela de contexto é o limite do que o modelo enxerga de uma vez. E a data de corte é até quando vai o conhecimento dele.

## Para a prova, lembre

- Um LLM gera texto prevendo o próximo token, um de cada vez.
- Token é um pedaço de texto. Custo e limites dos modelos são medidos em tokens.
- Parâmetros são os valores internos ajustados durante o treinamento.
- O Transformer, de 2017, usa o mecanismo de atenção para entender o contexto.
- Temperatura baixa deixa a resposta previsível. Temperatura alta deixa mais criativa e variada.
- Janela de contexto é o máximo de tokens que o modelo processa de uma vez.
- Sem ferramentas, o modelo não sabe de fatos posteriores à sua data de corte.
