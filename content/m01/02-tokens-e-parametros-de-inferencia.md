---
titulo: Tokens, geração e parâmetros de inferência
resumo: Tokenização, janela de contexto, como o modelo escolhe o próximo token, temperatura, top-k, top-p, limites de saída e latência.
---
Nesta aula, vamos abrir o momento em que o modelo está gerando a resposta, que tecnicamente se chama **inferência**. Quase todo ajuste fino de comportamento em produção passa por aqui: por que a mesma pergunta dá respostas diferentes, por que o JSON às vezes vem cortado, por que a conta ficou mais cara do que o previsto. Tudo isso se explica por tokens e parâmetros de inferência.

## O problema

O modelo não enxerga letras nem palavras. Ele enxerga números. Então precisamos de duas coisas: uma forma de transformar texto em números, que é a tokenização, e uma forma de transformar o que o modelo calcula de volta em texto, que é a decodificação. Cada uma tem consequências práticas de custo, limite e qualidade.

## Tokenização

O **tokenizador** quebra o texto em pedaços chamados **tokens** e associa cada pedaço a um número, o seu identificador no **vocabulário** do modelo. Os vocabulários modernos têm dezenas de milhares até algumas centenas de milhares de tokens.

Os tokenizadores atuais trabalham com **subpalavras**. Palavras frequentes viram um token só. Palavras raras são quebradas em pedaços menores. Isso resolve um problema antigo: com um vocabulário de palavras inteiras, qualquer palavra nova seria desconhecida. Com subpalavras, qualquer texto pode ser representado.

Os algoritmos mais comuns são o **BPE**, Byte Pair Encoding, usado pelas famílias GPT e Llama, o **WordPiece**, usado pelo BERT, e o **SentencePiece**, usado por modelos como T5. Você não precisa saber como cada um funciona por dentro. Precisa saber que eles quebram o texto em subpalavras e que **cada modelo tem o seu próprio tokenizador**. O mesmo texto vira quantidades diferentes de tokens em modelos diferentes.

Três consequências práticas. Primeira: **custo**. As APIs cobram por token de entrada e por token de saída, e o de saída costuma ser mais caro. Segunda: **idioma**. Os tokenizadores são otimizados principalmente para inglês, então um texto em português costuma gastar mais tokens do que o mesmo conteúdo em inglês. Terceira: **números e letras**. Como um número longo pode ser quebrado em pedaços arbitrários, e uma palavra não é vista letra por letra, os modelos têm dificuldade com aritmética exata e com tarefas como contar letras.

## Janela de contexto

A **janela de contexto** é o número máximo de tokens que o modelo processa numa chamada, somando **entrada e saída**. Entram aí o system prompt, o histórico da conversa, os documentos inseridos e a resposta gerada.

Se a soma passar do limite, a API recusa a chamada ou corta o texto. Por isso existe um parâmetro de **tamanho máximo de saída**, em inglês **max tokens**. Ele limita quantos tokens a resposta pode ter. Se o limite for baixo demais, a resposta é cortada no meio, e um JSON fica incompleto. Esse é um sintoma clássico em questões de troubleshooting: resposta truncada aponta para limite de tokens de saída ou para estouro da janela.

## Como o modelo escolhe o próximo token

Em cada passo da geração, o modelo produz um valor bruto para cada token do vocabulário. Esses valores se chamam **logits**. Uma função chamada **softmax** transforma os logits numa **distribuição de probabilidade**: cada token recebe uma chance, e todas somam cem por cento.

A partir daí, existem estratégias de escolha. A mais simples é a **decodificação gulosa**, em inglês **greedy decoding**: escolher sempre o token mais provável. É determinística, mas tende a produzir texto repetitivo. A alternativa é a **amostragem aleatória**: sortear o token de acordo com as probabilidades. Ela gera texto mais natural e variado, mas pode sair do rumo. Os parâmetros de inferência controlam esse sorteio.

## Temperatura, top-k e top-p

A **temperatura** atua antes do softmax, dividindo os logits. **Temperatura abaixo de um** deixa a distribuição mais concentrada: o token mais provável fica ainda mais provável. **Temperatura acima de um** achata a distribuição: tokens improváveis ganham chance. **Temperatura zero**, na prática, equivale à decodificação gulosa.

O **top-k** limita o sorteio aos **k tokens mais prováveis**. Com top-k igual a cinco, só os cinco melhores candidatos participam. Isso corta as opções absurdas da cauda da distribuição.

O **top-p**, também chamado de **amostragem de núcleo**, ou **nucleus sampling**, limita o sorteio ao **menor conjunto de tokens cuja probabilidade somada atinge p**. Com top-p igual a zero vírgula nove, entram os tokens mais prováveis até somar noventa por cento. A vantagem sobre o top-k é que o tamanho do conjunto se adapta: quando o modelo está confiante, entram poucos tokens; quando está em dúvida, entram mais.

Regra prática: para extração de dados, classificação e respostas factuais, use temperatura baixa. Para brainstorm e texto criativo, temperatura mais alta. E normalmente se ajusta **ou** a temperatura **ou** o top-p, e não os dois ao mesmo tempo de forma agressiva, porque os efeitos se somam e ficam difíceis de prever.

Mais dois parâmetros aparecem muito: as **sequências de parada**, ou **stop sequences**, que encerram a geração quando um texto específico aparece, e as **penalidades de repetição e de presença**, que desestimulam o modelo a repetir tokens.

Um detalhe que cai em prova: mesmo com temperatura zero, algumas APIs não garantem saída idêntica em todas as chamadas, por causa de detalhes de execução em GPU. Determinismo total não é garantido, mas temperatura zero chega perto.

## Latência e o KV cache

Duas métricas de latência importam. O **tempo até o primeiro token**, em inglês **time to first token**, mede quanto demora para a resposta começar a aparecer. Ele cresce com o tamanho da entrada, porque o modelo precisa processar o prompt inteiro antes de gerar. E os **tokens por segundo** medem a velocidade de geração depois disso. O tempo total cresce com o tamanho da saída, porque cada token é gerado em sequência.

Por isso, **respostas longas são caras e lentas**, e pedir respostas mais curtas é uma das otimizações mais simples. E o **streaming**, que mostra os tokens conforme são gerados, não reduz o tempo total, mas melhora muito a experiência percebida pelo usuário.

Internamente, os servidores usam o **KV cache**, um cache das chaves e valores do mecanismo de atenção dos tokens já processados, para não recalcular tudo a cada novo token. Ele acelera a geração, mas consome memória da GPU que cresce com o tamanho do contexto. Por isso contextos muito longos custam caro também para quem hospeda o modelo.

## Pegadinhas de prova

Primeira: achar que temperatura alta deixa o modelo mais inteligente ou mais preciso. Ela só aumenta a variedade.

Segunda: tentar resolver JSON malformado com temperatura. Temperatura reduz variação, mas o remédio para formato é saída estruturada com esquema e validação, que veremos no módulo 3.

Terceira: esquecer que a janela de contexto inclui a saída. Um prompt que ocupa quase toda a janela deixa pouco espaço para a resposta.

## Cenário resolvido

Um assistente de atendimento gera respostas longas, que às vezes são cortadas no meio, e o custo mensal está acima do orçamento. Qual é a melhor combinação de ações?

Resposta cortada no meio aponta para o limite de tokens de saída. Custo alto aponta para tokens demais, principalmente de saída, que são os mais caros. Então as ações são: instruir o modelo a responder de forma concisa, ajustar o max tokens com folga suficiente para a resposta esperada, e reduzir o contexto enviado, por exemplo resumindo o histórico antigo da conversa. Aumentar a temperatura não ajuda em nada aqui, e trocar para um modelo maior aumentaria ainda mais o custo.

## Resumo em um minuto

O tokenizador quebra o texto em subpalavras, com algoritmos como BPE, WordPiece e SentencePiece, e cada modelo tem o seu. Custo e limites são medidos em tokens, e português gasta mais tokens que inglês. A janela de contexto soma entrada e saída. O modelo produz logits, o softmax gera probabilidades, e a escolha pode ser gulosa ou por amostragem. Temperatura baixa concentra, alta espalha. Top-k fica com os k melhores, top-p com o núcleo que soma p. Respostas longas aumentam custo e latência, e o streaming melhora a experiência sem reduzir o tempo total.

## Termos-chave desta aula

- **Token**: pedaço de texto, geralmente uma subpalavra. É a unidade de custo e de limite.
- **Janela de contexto**: máximo de tokens por chamada, somando entrada e saída.
- **Max tokens**: limite do tamanho da resposta. Baixo demais corta a saída no meio.
- **Logits e softmax**: logits são as notas brutas de cada token; o softmax transforma em probabilidades.
- **Temperatura**: baixa deixa a resposta previsível; alta deixa variada.
- **Top-k e top-p**: limitam o sorteio aos tokens mais prováveis: os k melhores, ou o grupo que soma p.
- **Tempo até o primeiro token**: quanto demora para a resposta começar; cresce com o tamanho da entrada.
