---
titulo: Ciclo de vida de um projeto e escolha do modelo
resumo: As etapas do ciclo de vida de IA generativa, critérios de escolha do modelo, a escada prompt, RAG e fine-tuning, estimativa de custos e IA responsável no projeto.
---
Esta é a aula que amarra o módulo. Vamos ver o **ciclo de vida de um projeto de IA generativa** do começo ao fim, os **critérios para escolher um modelo**, como **estimar custo**, e onde entra a **IA responsável**. Essa visão de ponta a ponta é exatamente o que as provas de nível profissional cobram em questões de cenário.

## O ciclo de vida

O ciclo tem quatro grandes fases, que se repetem continuamente.

**Fase um: definir o escopo.** Qual é exatamente a tarefa? Um modelo que precisa fazer de tudo é muito mais difícil de garantir do que um que faz uma coisa bem feita. Ajuda pensar o trabalho como um **conjunto de tarefas**, e escolher as que geram mais valor e têm risco aceitável. Também é aqui que se definem os **critérios de sucesso**: que qualidade mínima, que latência, que custo por atendimento, e que comportamentos são inaceitáveis.

**Fase dois: escolher o modelo.** Usar um modelo pronto ou treinar o próprio, e qual modelo pronto. Veremos os critérios daqui a pouco.

**Fase três: adaptar e alinhar.** Engenharia de prompt, RAG, fine-tuning e, se necessário, alinhamento adicional. E, junto com isso, **avaliar** de forma contínua com um conjunto de avaliação próprio.

**Fase quatro: integrar e implantar.** Otimizar o modelo para inferência, com quantização ou um modelo menor, colocar em produção, integrar com os sistemas da empresa, e **monitorar** qualidade, custo, latência e segurança. O monitoramento alimenta a próxima volta do ciclo.

Uma diferença marcante em relação ao machine learning tradicional: com um modelo fundacional, um **protótipo funcional sai em dias**, sem coletar e rotular dados por meses. Por isso a recomendação é começar simples, medir e evoluir.

## A escada de adaptação

Na fase três, a ordem recomendada é uma escada, e a regra é só subir um degrau quando o anterior não bastar.

**Primeiro degrau: engenharia de prompt.** Instruções claras, exemplos few-shot, saída estruturada. Barato e rápido.

**Segundo degrau: RAG.** Quando o problema é **falta de conhecimento**, principalmente privado ou que muda.

**Terceiro degrau: fine-tuning.** Quando o problema é **comportamento**: formato, estilo, especialização, ou reduzir custo com um modelo menor.

**Último recurso: pré-treinamento.** Raríssimo, só para domínios com linguagem muito própria e orçamento enorme.

E os degraus se combinam: um sistema maduro pode ter um modelo ajustado com LoRA, usando RAG, com prompts bem desenhados.

## Critérios para escolher o modelo

Na hora de escolher, considere estes critérios.

**Qualidade na sua tarefa.** Medida com os seus dados, e não só com benchmarks públicos.

**Custo.** Preço por token de entrada e de saída, ou custo de infraestrutura no caso de modelos abertos.

**Latência.** Tempo até o primeiro token e velocidade de geração. Atendimento em tempo real exige baixa latência. Processamento noturno em lote, não.

**Janela de contexto.** Se a tarefa exige ler documentos longos.

**Modalidade.** Só texto, ou também imagem, áudio e documentos escaneados.

**Privacidade, residência de dados e conformidade.** Onde os dados são processados, o que o contrato permite, e as exigências regulatórias. No Brasil, a **LGPD**. Em bancos, também as normas do Banco Central. Isso pode levar a escolher um modelo aberto hospedado internamente, ou um provedor com garantias contratuais.

**Licença.** Especialmente em modelos abertos: há restrições de uso comercial?

**Capacidade de customização.** O modelo permite fine-tuning? Suporta function calling e saída estruturada?

Uma estratégia comum de arquitetura é usar **vários modelos**: um pequeno e barato para tarefas simples, e um grande só para as difíceis. Isso se chama **roteamento** ou **cascata de modelos**, e reduz muito o custo.

## Estimando custo

Uma conta que vale saber fazer. Suponha um assistente com cem mil conversas por mês, cada uma com uns três mil tokens de entrada, contando system prompt, histórico e trechos recuperados, e uns quinhentos de saída. São trezentos milhões de tokens de entrada e cinquenta milhões de saída por mês. Multiplique pelos preços do modelo, que normalmente são dados por milhão de tokens, com a saída mais cara.

Daí saem as alavancas de custo: **reduzir tokens de entrada**, enviando só os trechos relevantes e resumindo o histórico; **reduzir a saída**, pedindo respostas concisas; usar **cache de prompt**, quando o provedor oferece, para não pagar de novo pela parte fixa do prompt; **rotear** para modelos menores; e processar **em lote** o que não precisa de resposta imediata.

## IA responsável dentro do ciclo

IA responsável não é uma etapa no final. Ela atravessa o ciclo. No **escopo**, avaliar riscos e decidir onde é preciso **supervisão humana**. Na **escolha do modelo**, avaliar vieses e conformidade. Na **adaptação**, cuidar dos dados de treino, removendo informações pessoais. Na **avaliação**, incluir testes de segurança, justiça e tentativas de ataque, o chamado **red teaming**. Na **produção**, aplicar **guardrails**, registrar logs para auditoria, ser **transparente** com o usuário de que ele fala com uma IA, e manter uma pessoa ou equipe **responsável** pelo sistema.

Os princípios mais citados são: **justiça**, **transparência e explicabilidade**, **privacidade e segurança**, **robustez**, **responsabilização** e **supervisão humana**.

## Pegadinhas de prova

Primeira: pular direto para fine-tuning ou pré-treinamento sem tentar prompt e RAG. A prova quase sempre premia o caminho mais simples que resolve.

Segunda: escolher o maior modelo disponível para tudo. A palavra "melhor" na prova inclui custo e latência.

Terceira: tratar avaliação como uma etapa única antes do lançamento. Ela é contínua, e toda mudança exige reavaliação.

## Cenário resolvido

Um banco quer um assistente interno que responda dúvidas dos gerentes sobre normas de crédito, que mudam todo mês. Os dados não podem sair do ambiente do banco, o volume é moderado, e a equipe tem pouca experiência com IA. Qual é a abordagem mais adequada?

A restrição de dados aponta para um modelo hospedado no ambiente do banco, seja um modelo aberto, seja um serviço gerenciado com garantias de isolamento. Normas que mudam todo mês apontam para RAG, e não para fine-tuning. A pouca experiência da equipe reforça começar pelo mais simples: um bom prompt e RAG, com um conjunto de avaliação montado com perguntas reais dos gerentes, e revisão humana no início. Pré-treinar um modelo com as normas, ou fazer fine-tuning mensal, são as armadilhas.

## Resumo em um minuto

O ciclo de vida tem quatro fases que se repetem: escopo, escolha do modelo, adaptação com avaliação contínua, e integração com monitoramento. A escada de adaptação é prompt, depois RAG para conhecimento, depois fine-tuning para comportamento, e pré-treino como último recurso. Os critérios de escolha do modelo são qualidade nos seus dados, custo, latência, contexto, modalidade, privacidade e conformidade, licença e customização. Custos caem com menos tokens, cache de prompt, roteamento e lotes. E IA responsável atravessa todas as fases.
