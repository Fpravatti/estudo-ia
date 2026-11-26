---
titulo: Panorama da IA generativa e modelos fundacionais
resumo: Onde a IA generativa se encaixa, tipos de modelos generativos, modelos fundacionais e quando usar IA generativa ou machine learning tradicional.
---
Bem-vindo ao módulo 1, agora no nível da prova. A partir daqui, cada aula segue a mesma estrutura: qual problema o assunto resolve, como funciona por dentro, quando usar e quando não usar, as pegadinhas que costumam cair, e um cenário resolvido em voz alta, como se fosse uma questão. Se algum trecho não ficar claro, use o botão de dúvida do player. Ele guarda o ponto exato do áudio, e o curso vai sendo ajustado a partir das suas dúvidas.

Nesta primeira aula, vamos montar o mapa técnico: onde a IA generativa se encaixa, que tipos de modelos generativos existem, o que é um modelo fundacional, e a decisão mais básica que um engenheiro de IA toma: usar IA generativa ou machine learning tradicional.

## O mapa em trinta segundos

Inteligência artificial é o campo inteiro. Dentro dela, o **machine learning** aprende padrões a partir de dados em vez de regras escritas à mão. Dentro do machine learning, o **deep learning** usa redes neurais com muitas camadas. E a **IA generativa** é o conjunto de modelos, quase todos de deep learning, que **geram conteúdo novo**: texto, imagem, áudio, vídeo e código.

A diferença prática é o tipo de saída. Um modelo **discriminativo**, que é o machine learning tradicional, aprende a separar categorias ou prever um número: fraude ou não fraude, probabilidade de cancelamento, valor de um imóvel. Um modelo **generativo** aprende a distribuição dos dados e produz exemplos novos parecidos com eles.

## Os tipos de modelos generativos

Quatro famílias aparecem com frequência.

A primeira são os **modelos autorregressivos baseados em Transformer**, que é o caso dos LLMs. Eles geram uma sequência um pedaço por vez, sempre prevendo o próximo token a partir dos anteriores. É a família dominante para texto e código.

A segunda são os **modelos de difusão**, dominantes em imagem e cada vez mais em vídeo e áudio. Eles aprendem a remover ruído. No treino, a imagem vai recebendo ruído até virar estática pura, e o modelo aprende a desfazer esse processo passo a passo. Na geração, ele parte do ruído e vai limpando, guiado pelo texto do pedido. Veremos isso em detalhe no módulo 2.

A terceira são as **GANs**, redes adversárias generativas. Duas redes competem: um gerador tenta criar exemplos falsos convincentes, e um discriminador tenta distinguir o falso do real. Foram muito usadas para imagens antes da difusão, mas são instáveis de treinar.

A quarta são os **VAEs**, autoencoders variacionais. Eles comprimem os dados num espaço menor, chamado **espaço latente**, e aprendem a gerar a partir dele. Muitos modelos de difusão de imagem trabalham justamente nesse espaço latente, para economizar computação.

Para a prova, a associação mais importante é: texto e código, Transformer autorregressivo; imagem, difusão.

## Modelos fundacionais

O termo **modelo fundacional**, em inglês **foundation model**, foi popularizado por pesquisadores de Stanford em 2021. Ele descreve um modelo grande, treinado com dados amplos e variados, geralmente de forma autossupervisionada, que pode ser **adaptado para muitas tarefas diferentes**.

A palavra-chave é adaptação. Antes, cada tarefa tinha o seu próprio modelo, treinado do zero com dados rotulados: um para classificar reclamações, outro para traduzir, outro para resumir. Com um modelo fundacional, um único modelo pré-treinado resolve todas essas tarefas, seja só com instruções no prompt, seja com um ajuste fino leve.

Os LLMs são o exemplo mais conhecido de modelo fundacional, mas não o único. Existem modelos fundacionais de imagem, de áudio, e os **multimodais**, que recebem e às vezes geram mais de um tipo de dado, como texto e imagem ao mesmo tempo.

Uma consequência econômica importante: treinar um modelo fundacional custa dezenas ou centenas de milhões de dólares, então pouquíssimas organizações fazem isso. O trabalho do engenheiro de IA quase sempre começa **com um modelo fundacional pronto**, e se concentra em escolher o modelo, adaptá-lo e colocá-lo em produção com qualidade, segurança e custo controlado.

## Modelos abertos e modelos proprietários

Os modelos fundacionais se dividem em duas grandes categorias de acesso.

Os **proprietários**, ou fechados, como as famílias GPT, Claude e Gemini, são acessados por uma API do fornecedor. Você não tem acesso aos pesos do modelo. As vantagens são a qualidade, geralmente no topo, e a simplicidade: não há infraestrutura para manter. As desvantagens são o custo por token, a dependência do fornecedor e o fato de os dados saírem do seu ambiente, o que exige atenção a contratos e à proteção de dados.

Os **de pesos abertos**, como Llama, Mistral, Qwen e Gemma, podem ser baixados e executados na sua própria infraestrutura. As vantagens são controle total, privacidade dos dados, possibilidade de fine-tuning profundo e custo previsível em grande escala. As desvantagens são a necessidade de GPUs, de uma equipe para operar, e o cuidado com a **licença**, porque nem toda licença aberta permite qualquer uso comercial.

Repare que "pesos abertos" não é o mesmo que "código aberto" no sentido completo. Muitas vezes os pesos são liberados, mas os dados e o código de treinamento não.

## Quando usar IA generativa e quando não usar

Esta é a decisão mais cobrada em provas de nível profissional, e a regra é simples de enunciar.

Use **machine learning tradicional** quando a entrada é **estruturada**, como tabelas com colunas numéricas e categóricas, e a saída é **uma classe ou um número**. Detecção de fraude em transações, previsão de inadimplência, previsão de demanda, risco de crédito. Nesses casos, modelos como regressão logística ou árvores de decisão com gradient boosting são mais baratos, mais rápidos, mais precisos e mais fáceis de explicar a um regulador.

Use **IA generativa** quando a entrada ou a saída é **não estruturada**: texto livre, documentos, imagens, áudio, conversas. Resumir contratos, responder dúvidas a partir de manuais, extrair campos de documentos com formatos variados, gerar código, classificar mensagens de texto livre sem ter milhares de exemplos rotulados.

Há também a zona intermediária. Classificar reclamações em texto, por exemplo, pode ser feito com um LLM e um bom prompt, sem nenhum dado rotulado, ou com um modelo tradicional treinado com milhares de exemplos rotulados. O LLM permite começar em dias. O modelo tradicional pode sair mais barato por previsão quando o volume é enorme. Uma estratégia comum é começar com o LLM, coletar dados, e depois avaliar se vale treinar um modelo menor e especializado.

## Pegadinhas de prova

Primeira pegadinha: a alternativa que usa um LLM para um problema tabular clássico. Se a questão fala em prever fraude a partir de transações estruturadas e exige explicabilidade, a resposta raramente é um LLM.

Segunda: confundir **modelo fundacional** com **modelo de pesos abertos**. Um modelo fundacional pode ser proprietário ou aberto. Fundacional diz respeito à forma de treinar e usar, e não à licença.

Terceira: achar que difusão gera texto e Transformer gera imagem como padrão. Existem exceções, mas a associação padrão é Transformer para texto e difusão para imagem.

## Cenário resolvido

Um banco quer duas coisas. Primeiro, prever quais clientes têm risco de atrasar o pagamento do cartão no próximo mês, a partir do histórico de transações e de dados cadastrais. Segundo, responder automaticamente perguntas dos clientes sobre as regras do programa de pontos, que estão em um regulamento de quarenta páginas. Qual combinação faz mais sentido?

Vamos raciocinar. O primeiro problema tem entrada estruturada, saída numérica ou binária, e um contexto regulado que exige explicar a decisão. É um caso clássico de machine learning tradicional. O segundo problema tem entrada e saída em texto livre, e o conhecimento está num documento. É um caso de IA generativa, e mais especificamente de um LLM com recuperação dos trechos certos do regulamento, a técnica RAG, que veremos no módulo 5.

Resposta: machine learning tradicional para o risco de atraso, e um LLM com RAG para as perguntas sobre o regulamento. A alternativa que usa um LLM para as duas coisas é a armadilha.

## Resumo em um minuto

A IA generativa gera conteúdo novo, enquanto o machine learning tradicional, discriminativo, classifica ou prevê. As principais famílias generativas são os Transformers autorregressivos, para texto, a difusão, para imagem, além das GANs e dos VAEs. Um modelo fundacional é treinado com dados amplos e adaptado para muitas tarefas, e pode ser proprietário, acessado por API, ou de pesos abertos, executado na sua infraestrutura. Para dados estruturados com saída numérica ou de classe, prefira machine learning tradicional. Para dados não estruturados, IA generativa.

## Termos-chave desta aula

- **IA generativa**: gera conteúdo novo, como texto, imagem e código.
- **Modelo discriminativo**: o machine learning tradicional, que classifica ou prevê um número.
- **Difusão**: família de modelos que gera imagens removendo ruído passo a passo.
- **Modelo fundacional**: modelo grande, treinado com dados amplos, adaptável a muitas tarefas.
- **Pesos abertos**: modelo que você baixa e roda na sua infraestrutura, respeitando a licença.
- **Modelo proprietário**: modelo acessado pela API do fornecedor, sem acesso aos pesos.
