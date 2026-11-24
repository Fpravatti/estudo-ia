---
tipo: revisao
titulo: Os pontos-chave do módulo 1
resumo: Cinco minutos com tudo o que mais importa do módulo, para ouvir de novo nos dias seguintes.
---
Esta é a pílula de revisão do módulo 1. A ideia é ouvir este áudio mais de uma vez, nos próximos dias, para fixar os pontos mais importantes. Vamos lá.

## O mapa

Inteligência artificial é o campo de sistemas que fazem tarefas que exigiriam inteligência humana. Aprendizado de máquina é a IA que aprende com exemplos, em vez de regras escritas à mão. O aprendizado supervisionado aprende a ir de uma entrada A para uma saída B, usando dados rotulados. Deep learning usa redes neurais com muitas camadas. E a IA generativa cria conteúdo novo, como texto, imagem, áudio e código.

## O LLM

LLM é o modelo de linguagem grande. Ele gera texto prevendo o próximo token, um de cada vez. Token é um pedaço de texto, e custo e limites são medidos em tokens. Parâmetros são os valores internos ajustados no treinamento. A arquitetura por trás é o Transformer, de 2017, com o mecanismo de atenção. Temperatura baixa deixa as respostas previsíveis, e temperatura alta deixa mais criativas. A janela de contexto é o máximo que o modelo enxerga de uma vez. E a data de corte é até quando vai o conhecimento dele.

## O treinamento

Primeiro vem o pré-treinamento: muito texto, prever o próximo token, autossupervisionado e muito caro. Ele gera o modelo base, que completa textos mas não segue bem instruções. Depois vem o ajuste fino com instruções, com exemplos de pedidos e respostas. E depois o RLHF, aprendizado por reforço com feedback humano, para o modelo ser útil, honesto e inofensivo. PEFT e LoRA são formas baratas de fazer fine-tuning, mexendo em poucos parâmetros.

## Usos e limites

LLMs são bons em escrever, ler e conversar. As limitações principais são alucinação, data de corte, janela de contexto, contas exatas, vieses e riscos de segurança como o prompt injection. Para contornar, usamos RAG, ferramentas, guardrails e um humano no circuito.

## Prompts

Zero-shot é sem exemplos, one-shot com um exemplo e few-shot com alguns exemplos. Isso é aprendizado em contexto, e não muda os parâmetros do modelo. O system prompt define o comportamento do modelo. O modelo não tem memória própria: o aplicativo reenvia o histórico. E o custo é cobrado por tokens de entrada e de saída.

## O ciclo de vida

Definir o escopo, escolher o modelo, adaptar, avaliar, implantar e monitorar. Para adaptar, suba a escada: prompt, depois RAG, depois fine-tuning. RAG dá conhecimento. Fine-tuning muda comportamento.

## Responsabilidade

Analise o impacto da IA por tarefas. A IA pode automatizar ou aumentar o trabalho humano. Os princípios de IA responsável são justiça, transparência, privacidade e segurança, responsabilização e supervisão humana.

Muito bem. Se algum desses pontos ainda parece nebuloso, volte na aula correspondente. E agora, faça o quiz do módulo 1.
