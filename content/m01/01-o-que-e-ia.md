---
titulo: IA, machine learning e IA generativa: o mapa do território
resumo: O que é inteligência artificial, como as máquinas aprendem com exemplos e o que torna a IA generativa diferente.
---
Olá, que bom ter você aqui! Esta é a primeira aula da sua jornada para se tornar um engenheiro de IA. Antes de começar, um combinado: você não precisa saber nada de tecnologia para acompanhar. Toda palavra difícil vai ser explicada. E se alguma parte não ficar clara de primeira, tudo bem. Você pode voltar quinze segundos no botão do player, ou ouvir a aula de novo amanhã. Repetir faz parte do método.

Nesta aula, vamos desenhar o mapa do território. Vamos entender o que é inteligência artificial, o que é aprendizado de máquina, o que é deep learning, e onde entra a tal da IA generativa, que é o assunto principal da sua prova.

## O que é inteligência artificial

Inteligência artificial, ou simplesmente IA, é o nome que damos a qualquer sistema de computador que realiza tarefas que, normalmente, precisariam de inteligência humana. Coisas como reconhecer um rosto, entender uma frase, traduzir um texto ou decidir se uma compra no cartão parece suspeita.

Você usa IA o tempo todo, mesmo sem perceber. Quando o seu e-mail joga uma mensagem na caixa de spam, isso é IA. Quando a Netflix ou o Spotify recomendam algo que você acaba gostando, isso é IA. Quando o celular desbloqueia reconhecendo o seu rosto, também. E quando o banco bloqueia uma compra estranha no seu cartão e manda uma mensagem perguntando se foi você, isso é IA detectando fraude.

## Programar regras ou aprender com exemplos

Para entender a grande virada da IA moderna, pense em duas formas de ensinar um computador.

A primeira é a programação tradicional. Uma pessoa escreve regras, uma por uma. Por exemplo: se o e-mail tiver a palavra "promoção" e vier de um endereço desconhecido, mande para o spam. O problema é que o mundo é complicado demais para regras escritas à mão. Os spammers mudam as palavras, e as regras nunca dão conta de tudo.

A segunda forma é o **aprendizado de máquina**, que em inglês se chama **machine learning**. Em vez de escrever as regras, a gente mostra milhares de exemplos para o computador, e ele descobre os padrões sozinho. Mostramos milhares de e-mails que são spam e milhares que não são, e o sistema aprende a diferença.

É como ensinar uma criança a reconhecer um cachorro. Você não explica uma lista de regras do tipo "tem quatro patas, tem pelo, tem focinho". Você simplesmente aponta vários cachorros ao longo do tempo, e ela aprende. O aprendizado de máquina funciona com essa mesma ideia: aprender com exemplos.

## Aprendizado supervisionado: de A para B

O tipo mais comum de aprendizado de máquina se chama **aprendizado supervisionado**. A ideia é simples: o sistema aprende a transformar uma entrada, que vamos chamar de A, em uma saída, que vamos chamar de B.

Alguns exemplos. A entrada é um e-mail, e a saída é "spam" ou "não spam". A entrada é uma transação de cartão, e a saída é "fraude" ou "normal". A entrada é uma foto, e a saída é "tem um gato" ou "não tem um gato".

Para aprender, o sistema precisa de muitos exemplos já com a resposta certa. Esses exemplos com resposta se chamam **dados rotulados**. O rótulo é justamente a resposta certa: este e-mail é spam, aquele não é. Guarde essa expressão, dados rotulados, porque ela vai aparecer de novo.

## Deep learning e redes neurais

Dentro do aprendizado de máquina existe uma técnica que dominou a última década: o **deep learning**, que em português seria aprendizado profundo. Ele usa as chamadas **redes neurais**.

Uma rede neural é um programa inspirado, de forma bem livre, no funcionamento do cérebro. Ela é formada por várias camadas de pequenas unidades de cálculo, ligadas umas às outras. A palavra "profundo" vem justamente daí: são muitas camadas, uma depois da outra. Cada camada aprende algo um pouco mais complexo que a anterior.

O deep learning decolou por volta de 2012 por causa de três ingredientes que passaram a existir ao mesmo tempo. Primeiro, muitos dados disponíveis, graças à internet. Segundo, computadores muito mais potentes, principalmente as **GPUs**, que são chips criados originalmente para videogames e que fazem muitos cálculos em paralelo. E terceiro, avanços nas técnicas de treinamento. Uma regra que vale guardar: com redes neurais, quanto mais dados e mais poder de computação, melhor costuma ser o resultado.

## E a IA generativa?

Agora chegamos ao centro da sua prova. A **IA generativa** é a parte da IA que **cria conteúdo novo**: textos, imagens, áudios, vídeos e até código de programação.

Compare as duas perguntas. Uma IA tradicional responde algo como: "este e-mail é spam?". A resposta é uma classificação, sim ou não. Já uma IA generativa recebe um pedido como: "escreva um e-mail educado pedindo o reembolso de uma compra". E ela produz um texto inteiro, que não existia antes.

A IA generativa ficou famosa para o grande público no final de 2022, com o lançamento do ChatGPT. Mas ela não é só texto. Existem modelos que geram imagens a partir de uma descrição, modelos que compõem música, que geram vídeos, e modelos que geram voz. Aliás, uma curiosidade: a voz que você está ouvindo agora foi gerada por IA.

Os modelos que geram texto são chamados de **LLMs**, a sigla em inglês para modelos de linguagem grandes. Eles serão o assunto da próxima aula. Os modelos que geram imagens costumam usar uma técnica chamada **difusão**, que vamos ver no módulo 2.

## As bonecas russas

Uma boa forma de guardar tudo isso é pensar naquelas bonecas russas, uma dentro da outra.

A boneca maior é a **inteligência artificial**, o campo inteiro. Dentro dela está o **aprendizado de máquina**, que é a IA que aprende com exemplos. Dentro do aprendizado de máquina está o **deep learning**, que usa redes neurais com muitas camadas. E a **IA generativa** moderna é construída, quase toda, com deep learning.

Uma observação importante: a IA generativa não substitui a IA tradicional. As duas convivem. Um banco continua usando modelos tradicionais para detectar fraude, por exemplo, e usa IA generativa para outras tarefas, como resumir documentos ou responder clientes.

## E o que faz um engenheiro de IA?

Já que a sua trilha se chama "Engenheiro de IA", vale entender o papel. O engenheiro de IA é a pessoa que **constrói aplicações usando modelos de IA**. Na maioria das vezes, ele não cria um modelo do zero. Ele pega modelos prontos, como os que estão por trás do ChatGPT, e faz esses modelos trabalharem para resolver problemas reais.

Isso envolve escrever boas instruções para o modelo, conectar o modelo aos dados da empresa, fazer o modelo usar ferramentas, avaliar se as respostas estão boas, colocar o sistema no ar e cuidar da segurança. Cada uma dessas tarefas é um módulo da sua trilha. Então, o mapa da sua jornada é justamente o dia a dia de um engenheiro de IA.

## Resumo em um minuto

Inteligência artificial é o campo de sistemas que fazem tarefas que exigiriam inteligência humana. Aprendizado de máquina é a IA que aprende com exemplos, em vez de seguir regras escritas à mão. O aprendizado supervisionado aprende a ir de uma entrada A para uma saída B, usando dados rotulados. Deep learning é o aprendizado de máquina com redes neurais de muitas camadas, que se beneficia de muitos dados e de GPUs. E a IA generativa é a parte da IA que cria conteúdo novo, como texto, imagem, áudio e código.

## Para a prova, lembre

- IA generativa cria conteúdo novo. IA tradicional costuma classificar ou prever.
- Aprendizado supervisionado aprende de A para B usando dados rotulados.
- Deep learning usa redes neurais com muitas camadas e melhora com mais dados e mais computação.
- A ordem das bonecas: IA, depois aprendizado de máquina, depois deep learning, e a IA generativa construída sobre deep learning.
- O engenheiro de IA constrói aplicações com modelos prontos, em vez de criar modelos do zero.
