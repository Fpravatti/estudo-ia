---
titulo: Do problema ao produto: o ciclo de vida de um projeto de IA generativa
resumo: Escopo, escolha do modelo, prompt, RAG ou fine-tuning, avaliação, implantação e monitoramento.
---
Nesta aula, vamos ver como um engenheiro de IA tira uma ideia do papel e transforma em um sistema funcionando. Esse caminho tem nome: o **ciclo de vida de um projeto de IA generativa**. Ele aparece em vários cursos da sua trilha, e organiza tudo o que você vai estudar nos próximos módulos.

Para ficar concreto, vamos acompanhar um exemplo do começo ao fim: um assistente virtual que responde dúvidas de clientes sobre tarifas e serviços de uma conta bancária.

## Etapa 1: definir o escopo

Tudo começa com uma pergunta: **qual problema exatamente vamos resolver?** Essa etapa se chama definir o **escopo**.

Um erro comum é querer fazer tudo de uma vez. "Vamos criar uma IA que atende qualquer pedido de qualquer cliente." Isso é grande demais, e difícil de garantir que funcione bem. Um escopo melhor seria: "um assistente que responde dúvidas sobre tarifas e serviços da conta corrente, usando os documentos oficiais do banco. Se a pergunta for sobre outro assunto, ou se o cliente quiser fazer uma reclamação, a conversa passa para um atendente humano."

Uma técnica útil nessa etapa é olhar para o trabalho como um conjunto de **tarefas**. O trabalho de um atendente envolve várias tarefas: entender a dúvida, procurar a regra certa, explicar de forma simples, registrar o atendimento. Algumas dessas tarefas a IA faz bem, outras não. Escolher as tarefas certas é meio caminho andado.

## Etapa 2: escolher o modelo

Depois, escolhemos qual modelo usar. Algumas perguntas guiam essa escolha.

**Modelo grande ou pequeno?** Modelos grandes são mais capazes, mas são mais caros e mais lentos. Para tarefas simples, um modelo pequeno pode ser suficiente.

**Modelo fechado ou aberto?** Modelos **fechados**, como o GPT ou o Claude, são acessados por uma API da empresa que os criou. São fáceis de usar e costumam ser os mais poderosos, mas os dados enviados saem da sua empresa e vão para o fornecedor. Modelos **abertos**, também chamados de **open source** ou de **pesos abertos**, como o Llama, podem ser baixados e rodados nos servidores da própria empresa. Isso dá mais controle e privacidade, mas exige infraestrutura e equipe para manter.

Em um banco, onde os dados de clientes são sensíveis, essa decisão envolve também as áreas de segurança e jurídica. No Brasil, existe a **LGPD**, a Lei Geral de Proteção de Dados, que define regras para o uso de dados pessoais.

## Etapa 3: adaptar o modelo, subindo uma escada

Agora vem a parte de fazer o modelo funcionar bem para a nossa tarefa. Existem três técnicas principais, e um bom jeito de pensar nelas é como os degraus de uma escada. Você começa pelo degrau mais simples e só sobe se precisar.

**Primeiro degrau: engenharia de prompt.** Escrever boas instruções, dar contexto e exemplos. É rápido e barato. Muitas vezes, só isso já resolve.

**Segundo degrau: RAG.** Se o modelo precisa de informações que ele não conhece, como as tabelas de tarifas do banco, usamos RAG. O sistema busca os trechos certos nos documentos e coloca no prompt, junto com a pergunta. No nosso exemplo, esse degrau é essencial, porque as tarifas são específicas do banco e mudam com o tempo. A vantagem do RAG é que, quando uma regra muda, basta atualizar o documento, sem retreinar nada.

**Terceiro degrau: fine-tuning.** Se ainda assim o modelo não se comporta como queremos, por exemplo, não segue um formato muito específico, ou não fala no tom da marca, podemos ajustar o modelo com nossos próprios exemplos. O fine-tuning também pode permitir trocar um modelo grande e caro por um modelo pequeno e ajustado, mais barato para rodar.

Uma regra prática que vale ouro para a prova: **RAG é para dar conhecimento**, principalmente conhecimento que muda. **Fine-tuning é para mudar comportamento**, como estilo, formato ou especialização numa tarefa. E as duas técnicas podem ser usadas juntas.

## Etapa 4: avaliar

Como saber se o assistente está bom? Não dá para confiar em "parece que está funcionando". É preciso **avaliar** de forma organizada.

Primeiro, montamos um conjunto de perguntas de teste, de preferência baseadas em perguntas reais de clientes, com as respostas esperadas. Depois, medimos: o assistente acertou? A resposta foi baseada nos documentos, ou ele inventou algo? Ele recusou corretamente as perguntas fora do escopo?

Essa avaliação pode ser feita por pessoas, que leem as respostas e dão notas. Pode ser feita com regras automáticas. E existe uma técnica cada vez mais comum: usar **outro LLM como avaliador**, o chamado **LLM como juiz**, ou **LLM-as-a-judge**. Vamos ver tudo isso no módulo 8.

Um ponto importante: a avaliação não acontece só uma vez. Toda vez que mudamos o prompt, o modelo ou os documentos, avaliamos de novo, para garantir que nada piorou.

## Etapa 5: implantar e monitorar

Com o assistente aprovado, chega a hora de colocar no ar. Em inglês, isso se chama **deploy**, e em português, **implantar** ou colocar **em produção**.

Mas o trabalho não acaba aí. É preciso **monitorar** o sistema: quanto ele está custando, quanto tempo leva para responder, se a qualidade continua boa, se há tentativas de uso indevido. Também é importante coletar o **feedback** dos usuários, como aquele botão de "gostei" ou "não gostei".

E colocamos proteções, os **guardrails**: por exemplo, um filtro que impede o assistente de falar sobre assuntos fora do escopo, ou de mostrar dados pessoais.

O conjunto de práticas para colocar e manter LLMs em produção tem um nome: **LLMOps**. É assunto do módulo 8.

## É um ciclo, não uma linha reta

Repare que as etapas formam um **ciclo**. O monitoramento mostra problemas, que levam a ajustes no prompt, nos documentos ou no modelo. Isso exige nova avaliação, nova implantação, e assim por diante. O sistema vai sendo melhorado continuamente.

Uma diferença importante em relação ao aprendizado de máquina tradicional: antigamente, um projeto de IA começava com meses coletando e rotulando dados para treinar um modelo. Com a IA generativa, dá para construir um **protótipo em dias**, usando um modelo pronto e um bom prompt. Por isso, a recomendação é: comece simples, construa rápido, avalie e vá melhorando.

## Resumo em um minuto

O ciclo de vida de um projeto de IA generativa tem cinco etapas. Definir o escopo, olhando o trabalho como um conjunto de tarefas. Escolher o modelo: grande ou pequeno, fechado ou aberto. Adaptar o modelo, subindo a escada: primeiro prompt, depois RAG, depois fine-tuning. Avaliar de forma organizada, com conjuntos de teste e até LLM como juiz. E implantar e monitorar, com guardrails e feedback. Tudo isso forma um ciclo contínuo de melhoria.

## Para a prova, lembre

- Comece pelo mais simples: prompt, depois RAG, depois fine-tuning.
- RAG dá conhecimento externo e atualizável. Fine-tuning muda comportamento, estilo e formato.
- Modelos fechados via API são práticos; modelos abertos dão mais controle e privacidade.
- Avaliar é obrigatório e deve ser repetido a cada mudança.
- LLM-as-a-judge é usar um LLM para avaliar respostas de outro.
- LLMOps é o conjunto de práticas para operar LLMs em produção.
- Com IA generativa, dá para prototipar em dias, não em meses.
