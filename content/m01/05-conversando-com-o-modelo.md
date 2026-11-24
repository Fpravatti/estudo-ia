---
titulo: Conversando com o modelo: prompts, contexto e custos
resumo: O que é prompt, dicas para escrever bem, zero-shot e few-shot, mensagem de sistema, memória e custo por token.
---
Até aqui, vimos o que é um LLM e o que ele faz bem. Agora vamos aprender a falar com ele. Nesta aula, você vai entender o que é um prompt, como escrever um bom prompt, como funciona a memória de uma conversa e quanto custa usar um modelo.

## O que é um prompt

**Prompt** é o texto que você envia para o modelo. Pode ser uma pergunta, uma instrução, um pedido com exemplos, ou um documento inteiro seguido de uma pergunta. Tudo o que o modelo recebe como entrada é o prompt.

E **engenharia de prompt**, ou **prompt engineering**, é a habilidade de escrever prompts que fazem o modelo dar boas respostas. Ela é tão importante que tem um módulo inteiro na sua trilha, o módulo 3. Aqui, vamos ver o básico.

## Cinco dicas para um bom prompt

**Dica um: seja claro e específico.** Compare dois pedidos. O primeiro: "escreva sobre cartão de crédito". O segundo: "escreva um texto curto, de três parágrafos, explicando para um jovem de dezoito anos como funciona a fatura do cartão de crédito e por que pagar só o mínimo é perigoso". O segundo dá muito mais chance de sair o que você quer. O modelo não lê pensamentos. Quanto mais claro o pedido, melhor a resposta.

**Dica dois: dê contexto.** Diga ao modelo quem é o público, qual é o objetivo e qualquer informação de que ele precise. Uma técnica comum é definir um papel, por exemplo: "você é um atendente de banco, cordial e objetivo".

**Dica três: diga o formato da resposta.** Você quer uma lista? Uma tabela? No máximo cem palavras? Um texto em tom formal? Diga isso no prompt.

**Dica quatro: dê exemplos.** Mostrar exemplos do que você espera é uma das técnicas mais poderosas. E isso tem nomes técnicos que caem bastante em prova. Quando você pede algo sem dar nenhum exemplo, isso é chamado de **zero-shot**. Quando você dá um exemplo, é **one-shot**. E quando dá alguns exemplos, é **few-shot**. "Shot" aqui quer dizer tentativa, ou exemplo.

Por exemplo, para classificar reclamações, um prompt few-shot poderia ter: "Mensagem: minha fatura veio com uma compra que eu não fiz. Categoria: cartão. Mensagem: cobraram uma tarifa que eu não conhecia. Categoria: tarifas." E, no final, a nova mensagem que você quer classificar. O modelo entende o padrão a partir dos exemplos.

Repare numa coisa interessante: o modelo aprendeu a tarefa só com os exemplos dentro do prompt, sem nenhum treinamento novo. Os parâmetros dele não mudaram. Isso se chama **aprendizado em contexto**, ou **in-context learning**. É diferente do fine-tuning, que muda os parâmetros do modelo.

**Dica cinco: itere.** Raramente o primeiro prompt é perfeito. O processo normal é: escrever um prompt, ver a resposta, ajustar o prompt e tentar de novo. Engenharia de prompt é um processo de tentativa e melhoria.

E um bônus: para tarefas que exigem raciocínio, ajuda pedir ao modelo para **pensar passo a passo** antes de dar a resposta final. Essa técnica se chama **cadeia de pensamento**, ou **chain of thought**. Vamos ver no módulo 3.

## Mensagem de sistema e mensagem do usuário

Quando um aplicativo usa um LLM, o prompt geralmente é dividido em partes com papéis diferentes.

A **mensagem de sistema**, ou **system prompt**, é escrita pelo desenvolvedor do aplicativo. Ela define o comportamento geral do modelo, e o usuário normalmente não vê. Por exemplo: "você é o assistente virtual do banco. Responda só sobre produtos do banco. Seja educado. Nunca peça a senha do cliente".

A **mensagem do usuário** é o que a pessoa digita, como "qual é a tarifa da minha conta?".

E a resposta do modelo é chamada de mensagem do **assistente**.

## Como o modelo "lembra" da conversa

Aqui vai algo que surpreende muita gente: **o modelo, por si só, não tem memória**. Cada vez que ele recebe um prompt, é como se fosse a primeira vez.

Então como o ChatGPT lembra do que você falou três mensagens atrás? Simples: o aplicativo, a cada nova mensagem, **envia de novo todo o histórico da conversa** junto com a nova pergunta. O modelo lê tudo de novo e responde. É por isso que conversas muito longas ficam mais caras e podem esbarrar no limite da janela de contexto.

Essa ideia é fundamental para entender mais tarde a **memória de agentes**, no módulo 6. Lá, você vai ver técnicas para guardar e resumir informações importantes, para não precisar mandar tudo sempre.

## Quanto custa usar um LLM

Quando uma empresa usa um LLM por meio de uma API, ela paga por **tokens**. E normalmente há dois preços diferentes: um para os **tokens de entrada**, ou seja, o prompt, e outro para os **tokens de saída**, a resposta. Os tokens de saída costumam ser mais caros, porque gerar texto dá mais trabalho ao modelo do que ler.

Os preços mudam o tempo todo, e variam muito entre modelos. Modelos maiores e mais capazes custam mais por token. Modelos menores custam bem menos. Mas, para muitas tarefas, o custo de usar um LLM é pequeno quando comparado ao tempo que uma pessoa levaria para fazer o mesmo trabalho.

Além do custo, existe a **latência**, que é o tempo que o modelo leva para responder. Modelos maiores e respostas mais longas demoram mais. Num atendimento ao cliente, por exemplo, uma resposta muito lenta atrapalha a experiência. Custo e latência são duas coisas que o engenheiro de IA sempre precisa equilibrar com a qualidade.

## Uma prévia: dar documentos e ferramentas ao modelo

Para fechar, duas ideias que vão voltar muitas vezes.

A primeira: você pode colocar documentos dentro do prompt, e pedir que o modelo responda com base neles. É como fazer uma prova com consulta. Isso diminui alucinações e permite usar informações que o modelo não conhecia, como as regras internas de uma empresa. Quando isso é feito de forma automática, buscando os trechos certos numa base de documentos, chamamos de **RAG**.

A segunda: você pode dar **ferramentas** ao modelo, como uma calculadora, uma busca na internet ou o acesso a um sistema. O modelo decide quando usar cada ferramenta. Quando um modelo planeja passos, usa ferramentas e age para cumprir um objetivo, chamamos isso de **agente**.

## Resumo em um minuto

Prompt é tudo o que o modelo recebe como entrada, e engenharia de prompt é a arte de escrever bons prompts. As dicas são: seja claro, dê contexto, defina o formato, dê exemplos e itere. Sem exemplos é zero-shot, com um exemplo é one-shot, com alguns é few-shot, e isso é aprendizado em contexto, sem mudar os parâmetros. A mensagem de sistema define o comportamento do modelo. O modelo não tem memória: o aplicativo reenvia o histórico. E o custo é cobrado por tokens de entrada e de saída, com a saída geralmente mais cara.

## Para a prova, lembre

- Zero-shot: sem exemplos. One-shot: um exemplo. Few-shot: alguns exemplos.
- Aprendizado em contexto não altera os parâmetros. Fine-tuning altera.
- System prompt é a instrução do desenvolvedor que define o comportamento do modelo.
- O LLM não tem memória própria entre chamadas; o histórico é reenviado a cada mensagem.
- O custo é por token, de entrada e de saída; a saída costuma ser mais cara.
- Chain of thought: pedir para o modelo raciocinar passo a passo.
