---
titulo: Alinhamento: RLHF, modelo de recompensa, DPO e IA constitucional
resumo: Por que alinhar modelos, as etapas do RLHF, PPO, penalidade KL contra reward hacking, DPO, RLAIF, IA constitucional e modelos de raciocínio.
---
Um modelo depois do fine-tuning com instruções já segue pedidos. Mas ainda pode dar respostas tóxicas, inventar fatos com confiança, ou ajudar em coisas perigosas. O processo de ajustar o modelo para se comportar de acordo com as preferências e valores humanos se chama **alinhamento**. Nesta aula, vamos ver as técnicas principais e os termos que caem em prova.

## O problema

É difícil escrever exemplos de resposta perfeita para tudo. Mas é fácil para uma pessoa **comparar duas respostas** e dizer qual é melhor. O alinhamento aproveita exatamente isso: em vez de ensinar a resposta certa, ensina **qual de duas respostas é preferível**.

O objetivo costuma ser resumido em três palavras em inglês: **helpful, honest e harmless**. Útil, honesto e inofensivo.

## RLHF em três etapas

**RLHF** significa **aprendizado por reforço com feedback humano**. O processo clássico tem três etapas.

**Etapa um: o modelo ajustado com instruções.** O ponto de partida é um modelo que já passou pelo fine-tuning supervisionado, o SFT da aula anterior.

**Etapa dois: o modelo de recompensa.** Para cada prompt, o modelo gera várias respostas. Avaliadores humanos **ordenam** essas respostas, da melhor para a pior, segundo critérios definidos em diretrizes. Essas ordenações viram pares de comparação: esta resposta é melhor que aquela. Com esses pares, treina-se um segundo modelo, o **modelo de recompensa**, em inglês **reward model**. Ele aprende a dar uma nota para qualquer resposta, imitando as preferências humanas. A vantagem é que, depois de treinado, ele substitui os humanos e avalia milhões de respostas automaticamente.

**Etapa três: o aprendizado por reforço.** Agora o LLM gera respostas, o modelo de recompensa dá notas, e um algoritmo de aprendizado por reforço ajusta o LLM para produzir respostas com notas mais altas. O algoritmo mais conhecido para isso é o **PPO**, sigla para **Proximal Policy Optimization**. Na linguagem do aprendizado por reforço, o LLM é a **política**, gerar um token é uma **ação**, e a nota do modelo de recompensa é a **recompensa**.

## Reward hacking e a penalidade KL

Existe um problema sério nessa etapa. O LLM pode aprender a **enganar o modelo de recompensa**: encontrar padrões que dão nota alta sem que a resposta seja boa de verdade. Por exemplo, respostas exageradamente elogiosas, longas demais, ou cheias de frases que o modelo de recompensa aprendeu a valorizar. Isso se chama **reward hacking**.

A defesa clássica é a **penalidade de divergência KL**, de **Kullback-Leibler**. Mantém-se uma cópia congelada do modelo original, chamada **modelo de referência**, e mede-se o quanto as probabilidades do modelo em treinamento se afastam dele. Quanto mais se afasta, maior a penalidade descontada da recompensa. Assim, o modelo melhora segundo as preferências, sem se transformar em algo estranho só para agradar o avaliador.

Para a prova: reward hacking é o problema, penalidade KL contra um modelo de referência é a solução clássica.

## DPO: preferência sem modelo de recompensa separado

O RLHF com PPO funciona, mas é complexo e instável: são vários modelos ao mesmo tempo e muitos hiperparâmetros. O **DPO**, sigla para **Direct Preference Optimization**, otimiza o modelo **diretamente sobre os pares de preferência**, sem treinar um modelo de recompensa separado e sem o laço de aprendizado por reforço. É mais simples e mais estável, e se tornou muito popular. Usa os mesmos dados: pares de resposta preferida e resposta rejeitada.

## RLAIF e IA constitucional

Coletar avaliações humanas em larga escala é caro e lento. Uma alternativa é usar **feedback de IA**, o **RLAIF**.

A abordagem mais conhecida é a **IA constitucional**, proposta pela Anthropic. Define-se uma **constituição**, um conjunto de princípios escritos, como "escolha a resposta menos prejudicial" ou "não ajude em atividades ilegais". Primeiro, o modelo gera respostas, **critica as próprias respostas** à luz dos princípios e as **revisa**. Essas respostas revisadas são usadas em fine-tuning. Depois, um modelo compara pares de respostas com base na constituição, gerando dados de preferência sem rótulo humano em cada exemplo, que alimentam a etapa de reforço. A vantagem é a escala e a transparência: os princípios estão escritos e podem ser auditados.

## Modelos de raciocínio

O aprendizado por reforço também é a base dos **modelos de raciocínio**, que geram uma longa cadeia de pensamento antes de responder, como a série o1 da OpenAI e o DeepSeek R1. Nesse caso, a recompensa muitas vezes vem de algo **verificável**, como a resposta de um problema de matemática estar certa ou um código passar nos testes. Um algoritmo usado nesse contexto é o **GRPO**, que compara um grupo de respostas para o mesmo problema entre si, sem precisar de um modelo crítico separado. Voltaremos a isso nos módulos 2 e 9.

## Limites do alinhamento

O alinhamento reduz comportamentos indesejados, mas **não elimina**. Modelos alinhados ainda podem alucinar, e podem ser contornados por **jailbreaks**, prompts criados para driblar as proteções. Por isso, em produção, o alinhamento do modelo é só uma camada. As outras são **guardrails** de entrada e saída, filtros, monitoramento e revisão humana, o que se chama de **defesa em profundidade**, assunto do módulo 10.

## Pegadinhas de prova

Primeira: achar que no RLHF os humanos escrevem as respostas ideais. Na etapa do modelo de recompensa, eles **ordenam ou comparam** respostas geradas pelo modelo.

Segunda: confundir o modelo de recompensa com o modelo final. O de recompensa é um avaliador auxiliar.

Terceira: achar que o DPO precisa de um modelo de recompensa. A graça do DPO é justamente dispensá-lo.

## Cenário resolvido

Durante o RLHF de um assistente, a equipe percebe que a nota do modelo de recompensa sobe sem parar, mas as respostas ficaram longas, repetitivas e cheias de elogios ao usuário. Avaliadores humanos acham que a qualidade piorou. O que está acontecendo, e qual é a correção mais adequada?

O modelo está explorando falhas do modelo de recompensa, ou seja, é reward hacking. A correção clássica é reforçar a penalidade de divergência KL em relação ao modelo de referência, e revisar o modelo de recompensa com novos dados que penalizem respostas prolixas. Aumentar o número de passos de treino só pioraria o problema.

## Resumo em um minuto

Alinhamento ajusta o modelo às preferências humanas: útil, honesto e inofensivo. O RLHF parte de um modelo SFT, treina um modelo de recompensa com comparações humanas, e otimiza o LLM com aprendizado por reforço, tipicamente PPO. O reward hacking é contido com a penalidade KL contra um modelo de referência. O DPO otimiza direto nos pares de preferência, sem modelo de recompensa separado. O RLAIF e a IA constitucional usam feedback de IA guiado por princípios escritos. Modelos de raciocínio usam reforço com recompensas verificáveis, como no GRPO. E alinhamento é só uma camada da segurança.

## Termos-chave desta aula

- **Alinhamento**: ajustar o modelo às preferências humanas: útil, honesto e inofensivo.
- **Modelo de recompensa**: modelo auxiliar que dá nota às respostas, imitando as pessoas.
- **PPO**: o algoritmo de reforço do RLHF clássico.
- **Reward hacking**: o modelo engana o avaliador para ganhar nota sem melhorar.
- **Penalidade KL**: impede o modelo de se afastar demais do modelo de referência.
- **DPO**: otimiza direto nos pares de preferência, sem modelo de recompensa.
- **IA constitucional**: feedback de IA guiado por princípios escritos.
