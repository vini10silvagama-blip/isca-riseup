// Perguntas, referências de mercado, regra de cálculo e textos do mini diagnóstico e do relatório.
(function () {
  // Referências usadas na comparação. Só entram números com fonte.
  // Agendamento fica sem referência (não há fonte confiável).
  const REF = {
    comparecimento: { media: 0.77, fonte: "Revisão científica sobre faltas em consultas de saúde (2018): 23% de faltas" },
    fechamento: { media: 0.42, top: 0.75, fonte: "Henry Schein One, 2026 Catalyst Index (consultórios nos EUA)" },
    resposta: { fonte: "Harvard Business Review (2011)" },
  };

  const QUESTOES = [
    { etapa: "Contatos", p: "Quantos contatos novos chegam por mês (WhatsApp, Instagram, ligação)?", o: ["Até 30", "31 a 60", "61 a 100", "101 a 200", "Mais de 200", "Não sei"], v: [20, 45, 80, 150, 250, null],
      info: { icone: "contatos", txt: "É o ponto de partida: com o volume de contatos, dá para calcular quanto cada etapa do funil vale em reais." } },
    { etapa: "Agendamento", p: "De cada 10 contatos, quantos agendam avaliação?", o: ["Até 2", "3 a 4", "5 a 6", "7 ou mais", "Não sei"], v: [0.2, 0.35, 0.55, 0.75, null],
      info: { icone: "agenda", txt: "É aqui que a conversa vira compromisso. Cada contato que não agenda é investimento em anúncio que não chegou à cadeira." } },
    { etapa: "Comparecimento", p: "De cada 10 agendados, quantos comparecem?", o: ["Até 4", "5 a 6", "7 a 8", "9 ou 10", "Não sei"], v: [0.35, 0.55, 0.75, 0.9, null],
      info: { num: "23%", txt: "das consultas marcadas em saúde não acontecem por falta do paciente.", fonte: "Revisão científica sobre faltas · 2018" } },
    { etapa: "Fechamento", p: "De cada 10 orçamentos apresentados, quantos fecham?", o: ["Até 2", "3 a 4", "5 a 6", "7 ou mais", "Não sei"], v: [0.2, 0.35, 0.55, 0.75, null],
      info: { num: "42%", txt: "é a média de orçamentos aceitos nas clínicas; as melhores chegam a 75%.", fonte: "Henry Schein One · 2026" } },
    { etapa: "Valor do tratamento", p: "Qual o valor médio de um tratamento fechado?", o: ["Até R$ 3 mil", "R$ 3 a 8 mil", "R$ 8 a 15 mil", "R$ 15 a 30 mil", "Acima de R$ 30 mil", "Não sei"], v: [2000, 5500, 11500, 22500, 35000, null],
      info: { icone: "valor", txt: "Com o valor médio, cada ponto do funil vira reais por mês no seu diagnóstico." } },
    { etapa: "Primeira resposta", p: "Quanto tempo leva a primeira resposta a um contato novo?", o: ["Em minutos", "Em até 1 hora", "No mesmo dia", "No dia seguinte ou depois", "Não sei"],
      info: { num: "7x", txt: "mais chance de converter quem recebe resposta em até 1 hora.", fonte: "Harvard Business Review · 2011" } },
    { etapa: "Fechamento", p: "Quando o paciente não fecha, o que mais acontece?", o: ["Diz que achou caro", "Diz que vai comparar com outras clínicas", "Diz que vai pensar", "Precisa falar com cônjuge, família ou sócio", "Tem medo ou dúvida sobre o tratamento", "Diz que vai começar depois", "Some sem responder", "Outro motivo", "Não sei"], outro: 7,
      info: { icone: "motivo", txt: "O motivo mais comum mostra se o problema está no preço, na explicação do plano ou no acompanhamento." } },
    { etapa: "Retorno", p: "O que acontece com o orçamento que não fecha na hora?", o: ["Ninguém retorna", "Só retorna se o paciente chamar", "Uma tentativa de contato", "Duas ou três tentativas, sem datas definidas", "Rotina definida, com datas e mensagens", "Não sei"],
      info: { icone: "retorno", txt: "Quem não fecha na hora raramente volta sozinho. A forma de retomar o orçamento define quanto disso ainda vira tratamento." } },
  ];

  const s = (t) => `<div class="script"><p>${t}</p><button type="button" class="copy">Copiar</button></div>`;

  const ETAPAS = {
    primeira: {
      nome: "Primeira resposta",
      explicacao: "O contato chega, mas a resposta demora ou não puxa conversa. Quando a clínica responde, o paciente já esfriou ou falou com outra clínica.",
      ferramenta: "Kit de primeiras mensagens",
      html:
        `<p class="tool-rule"><strong>Regra de tempo:</strong> responder em até 15 minutos no horário comercial. Fora do horário, a resposta automática segura o contato até a manhã seguinte.</p>` +
        `<h4>Contato pelo WhatsApp</h4>` + s("Olá, [nome]! Aqui é a [atendente], da [clínica]. Vi que você se interessou por [procedimento]. Para eu te orientar melhor: é a primeira vez que você busca esse tratamento ou já fez alguma avaliação?") +
        `<h4>Contato pelo Instagram</h4>` + s("Oi, [nome]! Que bom que você chamou. Para eu te passar as informações certas, me conta: o que te fez procurar esse tratamento agora?") +
        `<h4>Resposta automática fora do horário</h4>` + s("Olá! Aqui é da [clínica]. Recebemos sua mensagem e amanhã cedo a [atendente] te responde pessoalmente. Se puder, já me conta o que você está buscando, que ela chega com tudo preparado.") +
        `<h4>Na manhã seguinte</h4>` + s("Bom dia, [nome]! Aqui é a [atendente], da [clínica]. Li sua mensagem de ontem. [retomar o que a pessoa escreveu]. Posso te fazer duas perguntas rápidas para te orientar?") +
        `<h4>Ligação perdida</h4>` + s("Olá! Aqui é da [clínica], vi que você tentou ligar e não conseguimos atender. Como posso te ajudar?"),
    },
    agendamento: {
      nome: "Agendamento",
      explicacao: "A conversa acontece, mas não vira avaliação marcada. Em geral, o preço entra antes do motivo para vir até a clínica.",
      ferramenta: "Sequência até a avaliação",
      html:
        `<h4>1. Quando pergunta o preço</h4>` + s("Faz sentido querer saber o valor, [nome]. Ele depende do seu caso, e é na avaliação que o(a) Dr(a). [nome] define o que você precisa. Tenho horário [dia] às [hora] ou [dia] às [hora]. Qual fica melhor?") +
        `<h4>2. Se insistir no preço</h4>` + s("Entendo. Se eu te passar um número agora, posso errar para mais ou para menos, porque cada caso é diferente. Na avaliação você sai com o plano e o valor exato, sem compromisso. [Se a clínica permitir: os tratamentos costumam partir de R$ (valor).] Quer que eu reserve um desses horários?") +
        `<h4>3. Se pedir para pensar (use só se for verdade)</h4>` + s("Claro. Só te aviso que a agenda do(a) Dr(a). [nome] desta semana está quase fechada. Posso segurar [dia] às [hora] até amanhã para você?") +
        `<h4>4. Confirmação do agendamento</h4>` + s("Pronto, [nome]! Sua avaliação ficou para [dia], [data], às [hora], com o(a) Dr(a). [nome]. Endereço: [endereço]. Chegue uns 10 minutos antes. Qualquer imprevisto, é só me avisar por aqui."),
    },
    comparecimento: {
      nome: "Comparecimento",
      explicacao: "O paciente agenda, mas não aparece. Cada falta é um horário perdido e um contato que a clínica já pagou para gerar.",
      ferramenta: "Mensagens de confirmação",
      html:
        `<h4>No ato do agendamento</h4>` + s("Pronto, [nome]! Sua avaliação ficou para [dia], [data], às [hora], com o(a) Dr(a). [nome]. Endereço: [endereço]. Chegue uns 10 minutos antes. Qualquer imprevisto, é só me avisar por aqui.") +
        `<h4>Na véspera</h4>` + s("Oi, [nome]! Passando para confirmar sua avaliação amanhã, [data], às [hora]. Responde com 1 para confirmar ou 2 se precisar remarcar.") +
        `<h4>No dia, 2 horas antes</h4>` + s("[nome], te esperamos hoje às [hora]! Se precisar, o endereço é [endereço].") +
        `<p class="tool-rule"><strong>Se não confirmou na véspera:</strong> ligar de manhã, no dia da avaliação.</p>` +
        `<h4>Se faltou</h4>` + s("Oi, [nome], sentimos sua falta hoje. Imagino que surgiu algum imprevisto. Quer que eu veja um novo horário? Tenho [dia] às [hora] ou [dia] às [hora].") +
        `<h4>Se pediu para remarcar</h4>` + s("Sem problema! Tenho [dia] às [hora] ou [dia] às [hora]. Qual fica melhor?"),
    },
    orcamento: {
      nome: "Orçamento",
      explicacao: "O paciente chega à avaliação, ouve o valor e passa a comparar só preço. O valor apareceu antes de ele entender o que está comprando.",
      ferramenta: "Roteiro \"valor antes do preço\"",
      html:
        `<p class="tool-rule">Para o dentista usar na avaliação, nesta ordem.</p>` +
        `<ol class="steps">` +
        `<li><strong>Retomar a queixa.</strong> "Você me disse que o que mais te incomoda é [queixa nas palavras do paciente]. É isso mesmo?"</li>` +
        `<li><strong>Mostrar o que encontrou.</strong> Explicar o diagnóstico com imagem, raio-x ou espelho, em linguagem simples.</li>` +
        `<li><strong>Apresentar o plano.</strong> "Para resolver isso, o caminho é [plano], em [número] etapas, em cerca de [prazo]."</li>` +
        `<li><strong>Mostrar como fica depois.</strong> O que muda no dia a dia do paciente (comer, sorrir, conforto), sem prometer resultado.</li>` +
        `<li><strong>Só então o valor, com o próximo passo.</strong> "O investimento fica em R$ [valor], e pode ser [formas de pagamento]. Podemos começar em [data]. Faz sentido para você?"</li>` +
        `</ol><p class="tool-rule">Depois do valor, o dentista espera o paciente falar primeiro.</p>`,
    },
    fechamento: {
      nome: "Fechamento",
      explicacao: "O paciente sai com o orçamento e um \"vou pensar\". Sem descobrir o que falta para decidir, a decisão fica com ele, e quase sempre esfria.",
      ferramenta: "Script do \"vou pensar\"",
      html:
        `<h4>Pergunta principal</h4>` + s("Claro, é uma decisão importante. Para eu te ajudar a pensar: o que ficou de dúvida? É mais sobre o valor, sobre o tratamento em si ou você quer conversar com alguém antes?") +
        `<h4>Se for o valor</h4>` + s("Entendo. Vamos ver juntos uma forma de pagamento que caiba no seu mês? Temos [opções].") +
        `<h4>Se for dúvida ou receio do tratamento</h4>` + s("É normal. O que mais te preocupa? [responder]. Se quiser, o(a) Dr(a). [nome] tira essa dúvida com você agora.") +
        `<h4>Se precisar falar com outra pessoa</h4>` + s("Faz sentido. Quer que eu te mande um resumo do plano por escrito para você mostrar? E se ajudar, ele(a) pode vir junto numa conversa rápida.") +
        `<h4>Se for agenda ou momento</h4>` + s("Entendo. Para quando você imagina começar? Já posso deixar uma data pré-reservada.") +
        `<h4>Antes de o paciente sair</h4>` + s("Combinado. Te mando uma mensagem [dia] para saber o que você decidiu, pode ser?"),
    },
    retorno: {
      nome: "Retorno",
      explicacao: "Orçamentos apresentados ficam sem acompanhamento. Quem não fechou na hora dificilmente volta sozinho.",
      ferramenta: "Planilha de orçamentos parados",
      html:
        `<p class="tool-rule"><strong>Colunas da planilha:</strong> Paciente · WhatsApp · Data do orçamento · Tratamento · Valor · Motivo de não ter fechado · Último contato · Próximo contato · Situação (Em aberto / Fechou / Perdido) · Observações.</p>` +
        `<button type="button" class="btn btn-outline" id="baixar-planilha">Baixar planilha</button>` +
        `<h4>Depois de 2 dias</h4>` + s("Oi, [nome]! Aqui é a [atendente], da [clínica]. Estou revendo seu plano de tratamento com o(a) Dr(a). [nome]. Ficou alguma dúvida sobre o que conversamos na avaliação?") +
        `<h4>Depois de 5 dias</h4>` + s("[nome], lembrei de você porque [motivo novo: abriu horário, nova forma de pagamento, resposta a uma dúvida que ele teve]. Quer que eu veja isso para você?") +
        `<h4>Depois de 10 dias</h4>` + s("Oi, [nome]! Ainda faz sentido para você começar o tratamento? Se tiver algo te impedindo, me conta que eu vejo como ajudar.") +
        `<h4>Depois de 20 dias</h4>` + s("[nome], vou deixar seu plano guardado aqui. Quando quiser retomar, é só me chamar que eu organizo tudo.") +
        `<p class="tool-rule"><strong>Depois de 30 dias:</strong> encerrar e marcar como Perdido, com o motivo. Cada mensagem traz um motivo novo, nunca "e aí, decidiu?".</p>`,
    },
  };


  // "O que fazer esta semana": um passo rápido da etapa mais fraca, com a conversa de exemplo.
  // Tipos de linha da conversa: d = data, p = paciente, c = clínica.
  const SEMANA = {
    primeira: {
      titulo: "Responder em minutos, começando com uma pergunta",
      texto: "Quem chama à noite ou no fim de semana costuma falar com outras clínicas ao mesmo tempo. A primeira resposta precisa chegar rápido e abrir a conversa, não mandar a tabela.",
      chat: [["d", "Hoje"], ["p", "Oi, boa noite! Queria saber sobre implante.", "21:40"], ["c", "Olá, Ana! Aqui é a Júlia, da clínica. Para eu te orientar melhor: é a primeira vez que você busca esse tratamento ou já fez alguma avaliação?", "21:43"], ["p", "É a primeira vez! Queria entender como funciona.", "21:45"]],
      copiar: "Olá, [nome]! Aqui é a [atendente], da [clínica]. Para eu te orientar melhor: é a primeira vez que você busca esse tratamento ou já fez alguma avaliação?",
    },
    agendamento: {
      titulo: "Responder o preço com dois horários de avaliação",
      texto: "Quando o preço vem antes do motivo para ir até a clínica, a conversa vira comparação. Reconheça a pergunta, explique a avaliação e ofereça 2 horários.",
      chat: [["d", "Hoje"], ["p", "Quanto custa o implante?", "14:02"], ["c", "Faz sentido querer saber, Ana. O valor depende do seu caso, e a Dra. Paula define isso na avaliação. Tenho quinta às 10h ou sexta às 15h. Qual fica melhor?", "14:04"], ["p", "Quinta às 10h.", "14:06"]],
      copiar: "Faz sentido querer saber o valor, [nome]. Ele depende do seu caso, e é na avaliação que o(a) Dr(a). [nome] define o que você precisa. Tenho horário [dia] às [hora] ou [dia] às [hora]. Qual fica melhor?",
    },
    comparecimento: {
      titulo: "Confirmar na véspera, pedindo uma resposta",
      texto: "Um lembrete genérico é fácil de ignorar. Uma confirmação com resposta de 1 toque mostra quem vem e abre espaço para remarcar quem não pode.",
      chat: [["d", "Ontem"], ["c", "Oi, Ana! Confirmando sua avaliação amanhã, quinta, às 14h com a Dra. Paula. Responde 1 para confirmar ou 2 se precisar remarcar.", "18:30"], ["p", "1", "18:41"], ["c", "Perfeito, te esperamos! O endereço é [endereço].", "18:42"]],
      copiar: "Oi, [nome]! Confirmando sua avaliação amanhã, [data], às [hora] com o(a) Dr(a). [nome]. Responde 1 para confirmar ou 2 se precisar remarcar.",
    },
    orcamento: {
      titulo: "Mostrar o plano antes do valor",
      texto: "Quando o valor aparece antes de o paciente entender o que está comprando, ele compara só preço. Retome a queixa, mostre o plano e só então o valor.",
      chat: [["d", "Hoje"], ["c", "Ana, como conversamos: o que mais te incomoda hoje é [queixa]. O plano da Dra. Paula resolve isso em [prazo].", "16:20"], ["p", "Isso! E qual o valor?", "16:24"], ["c", "Fica em R$ [valor], e dá para parcelar em [formas]. Podemos começar dia [data]?", "16:25"]],
      copiar: "[nome], como conversamos: o que mais te incomoda hoje é [queixa]. O plano do(a) Dr(a). [nome] resolve isso em [prazo].",
    },
    fechamento: {
      titulo: "Perguntar o que falta antes do \"vou pensar\"",
      texto: "O \"vou pensar\" quase sempre esconde uma dúvida. Perguntando o que falta, a decisão volta para a conversa em vez de esfriar em casa.",
      chat: [["d", "Hoje"], ["p", "Vou pensar e te falo.", "11:10"], ["c", "Claro, é uma decisão importante! O que ficou de dúvida: o valor, o tratamento ou você quer conversar com alguém antes?", "11:12"], ["p", "Na verdade, é o valor.", "11:15"]],
      copiar: "Claro, é uma decisão importante. Para eu te ajudar a pensar: o que ficou de dúvida? É mais sobre o valor, sobre o tratamento em si ou você quer conversar com alguém antes?",
    },
    retorno: {
      titulo: "Retomar os orçamentos em 2 dias, com motivo novo",
      texto: "Quem não fecha na hora raramente volta sozinho. Uma mensagem 2 dias depois, retomando o plano, reabre a conversa sem pressionar.",
      chat: [["d", "2 dias depois"], ["c", "Oi, Ana! Aqui é a Júlia, da clínica. Estou revendo seu plano com a Dra. Paula. Ficou alguma dúvida sobre a avaliação?", "09:30"], ["p", "Fiquei sim, sobre o tempo de tratamento.", "10:02"]],
      copiar: "Oi, [nome]! Aqui é a [atendente], da [clínica]. Estou revendo seu plano de tratamento com o(a) Dr(a). [nome]. Ficou alguma dúvida sobre o que conversamos na avaliação?",
    },
    naomede: {
      titulo: "Contar o funil durante 7 dias",
      texto: "Sem os números, não dá para saber onde está a perda. Esta semana, anote todo dia: contatos novos, avaliações agendadas, quem compareceu e quem fechou.",
      chat: null,
      copiar: "Contatos novos: __ · Agendaram: __ · Compareceram: __ · Fecharam: __",
    },
  };

  // Plano de 30 dias do relatório, pela etapa mais fraca.
  const PLANO = {
    primeira: ["Definir quem responde o WhatsApp em cada horário", "Ativar a resposta automática fora do horário, com uma pergunta", "Usar o kit de primeiras mensagens em todo contato novo", "Medir o tempo da primeira resposta e quantos contatos agendam"],
    agendamento: ["Responder o preço sempre com 2 horários de avaliação", "Registrar todo contato novo e se ele agendou", "Retomar em até 24 horas quem não agendou", "Comparar quantos agendam agora com o início do mês"],
    comparecimento: ["Confirmar toda avaliação na véspera, pedindo resposta 1 ou 2", "Remarcar no mesmo dia quem faltou, oferecendo 2 horários", "Ligar de manhã para quem não confirmou na véspera", "Medir o comparecimento e comparar com a média (77%)"],
    orcamento: ["Usar o roteiro \"valor antes do preço\" em toda avaliação", "Entregar o orçamento por escrito, com as formas de pagamento", "Combinar o próximo contato antes de o paciente sair", "Medir quantos orçamentos fecham em até 7 dias"],
    fechamento: ["Usar o script do \"vou pensar\" em toda avaliação", "Registrar o motivo de quem não fecha", "Ter condições de pagamento prontas para os tratamentos maiores", "Medir o fechamento e comparar com a média (42%)"],
    retorno: ["Listar os orçamentos dos últimos 90 dias", "Mandar a mensagem de 2 dias para todos em aberto", "Seguir a sequência de 5, 10 e 20 dias, sempre com motivo novo", "Marcar cada orçamento como fechado ou perdido, com o motivo"],
    naomede: ["Contar contatos, agendamentos, comparecimentos e fechamentos", "Registrar a origem de cada contato novo", "Refazer este diagnóstico com os números reais", "Escolher a etapa mais fraca e corrigir primeiro"],
  };

  const NAO_MEDE = {
    nome: "Não mede o funil",
    explicacao: "Sem saber quantos agendam, comparecem e fecham, não dá para saber onde está a perda. O primeiro passo é medir.",
    ferramenta: "Planilha do funil da semana",
    html: `<p class="tool-rule">Anote todo dia, durante 7 dias: contatos novos, avaliações agendadas, quem compareceu, orçamentos apresentados e quem fechou. Com isso, refaça o diagnóstico com os números reais.</p>`,
  };

  // Faixas de faturamento da captura, em reais por mês (mínimo e máximo).
  const FAIXAS = {
    "Até R$ 30 mil": [0, 30000], "R$ 30 a 50 mil": [30000, 50000], "R$ 50 a 70 mil": [50000, 70000],
    "R$ 70 a 100 mil": [70000, 100000], "R$ 100 a 150 mil": [100000, 150000], "R$ 150 a 300 mil": [150000, 300000], "Acima de R$ 300 mil": [300000, Infinity],
  };

  function valor(a, i) {
    const q = QUESTOES[i];
    return q.v ? q.v[a[i]] ?? null : null;
  }

  function mil(v) {
    const k = Math.round(v / 1000);
    return k < 1 ? "menos de R$ 1 mil" : `R$ ${k.toLocaleString("pt-BR")} mil`;
  }
  function texto(v) { return v < 1000 ? "menos de R$ 1 mil" : "cerca de " + mil(v); }
  const pct = (x) => Math.round(x * 100) + "%";

  function validar(a) {
    return Array.isArray(a) && a.length === QUESTOES.length && a.every((x, i) => Number.isInteger(x) && x >= 0 && x < QUESTOES[i].o.length);
  }

  function calcular(a, opcoes) {
    const faixa = opcoes && opcoes.faixa;
    const C = valor(a, 0), A = valor(a, 1), P = valor(a, 2), F = valor(a, 3), T = valor(a, 4);
    const q6 = a[5], q7 = a[6], q8 = a[7];
    const mP = REF.comparecimento.media, mF = REF.fechamento.media, topF = REF.fechamento.top;

    const desconhecidas = [A, P, F].filter((x) => x === null).length;
    const estimadas = [];
    if (P === null) estimadas.push("Comparecimento");
    if (F === null) estimadas.push("Fechamento");
    const Pc = P ?? mP, Fc = F ?? mF;

    // Faturamento dos contatos novos: hoje e chegando à média.
    let hoje = null, naMedia = null, estimativa = null, ganhoComp = null, ganhoFech = null, modo = "media", ganhoTop = null;
    const temReais = C !== null && A !== null && T !== null;
    if (temReais) {
      hoje = C * A * Pc * Fc * T;
      naMedia = C * A * Math.max(Pc, mP) * Math.max(Fc, mF) * T;
      estimativa = Math.max(0, naMedia - hoje);
      ganhoComp = Math.max(0, C * A * Math.max(Pc, mP) * Fc * T - hoje);
      ganhoFech = Math.max(0, C * A * Pc * Math.max(Fc, mF) * T - hoje);
      if (estimativa < 1 && Fc < topF) {
        modo = "top";
        ganhoTop = C * A * Pc * topF * T - hoje;
      }
    }

    // Etapa mais fraca: a maior diferença em relação à média (comparecimento ou fechamento).
    let etapa;
    const gaps = [];
    if (P !== null && P < mP) gaps.push(["comparecimento", temReais ? ganhoComp : mP - P]);
    if (F !== null && F < mF) gaps.push(["fechamento", temReais ? ganhoFech : mF - F]);
    const refinarFechamento = () => {
      if (q7 === 0 || q7 === 1) return "orcamento";
      if (q7 === 6 || q8 === 0 || q8 === 1) return "retorno";
      return "fechamento";
    };
    // "Não sei" vira o achado principal quando faltam 2 taxas, ou quando falta 1 e não há diferença clara (5 pontos ou mais).
    const gapForte = (P !== null && mP - P >= 0.05) || (F !== null && mF - F >= 0.05);
    const naoMede = desconhecidas >= 2 || (desconhecidas === 1 && !gapForte);
    if (naoMede) etapa = "naomede";
    else if (gaps.length) {
      const pior = gaps.sort((x, y) => y[1] - x[1])[0][0];
      etapa = pior === "comparecimento" ? "comparecimento" : refinarFechamento();
    } else if (q6 === 2 || q6 === 3) etapa = "primeira";
    else if (q8 === 0 || q8 === 1) etapa = "retorno";
    else if (A !== null && A <= 0.2) etapa = "agendamento";
    else etapa = refinarFechamento();

    // Texto de abertura com os números da clínica.
    let abertura;
    const naoSabe = { Agendamento: "quantos contatos agendam", Comparecimento: "quantos pacientes comparecem", Fechamento: "quantos orçamentos fecham" };
    const faltando = [["Agendamento", A], ["Comparecimento", P], ["Fechamento", F]].filter((x) => x[1] === null).map((x) => naoSabe[x[0]]);
    if (etapa === "naomede") abertura = faltando.length === 1
      ? `Você não sabe ${faltando[0]}. Sem esse número, não dá para ver onde está a perda. Para a estimativa, usamos a média do mercado.`
      : NAO_MEDE.explicacao;
    else if (modo === "top") abertura = "Seu funil já está na média do mercado em comparecimento e fechamento. O próximo marco são as melhores clínicas, que fecham 75% dos orçamentos.";
    else if (etapa === "comparecimento") abertura = `De cada 100 pacientes que agendam, cerca de ${Math.round(P * 100)} aparecem. A média do mercado é 77. É a maior diferença entre o seu funil e a média.`;
    else if ((etapa === "fechamento" || etapa === "orcamento" || etapa === "retorno") && F !== null && F < mF) abertura = `De cada 100 orçamentos, cerca de ${Math.round(F * 100)} fecham. A média do mercado é 42, e as melhores clínicas chegam a 75. ${ETAPAS[etapa].explicacao}`;
    else abertura = ETAPAS[etapa].explicacao;

    const funil = C !== null && A !== null ? [
      { rotulo: "Contatos", n: C },
      { rotulo: "Agendam", n: Math.round(C * A) },
      { rotulo: "Comparecem", n: Math.round(C * A * Pc), estimado: P === null },
      { rotulo: "Fecham", n: Math.round(C * A * Pc * Fc), estimado: P === null || F === null },
    ] : null;

    const comparacoes = [
      { chave: "agendamento", nome: "Agendam", valor: A, media: null, top: null },
      { chave: "comparecimento", nome: "Comparecem", valor: P, media: mP, top: null },
      { chave: "fechamento", nome: "Fecham", valor: F, media: mF, top: topF },
    ];

    // Cruzamento entre a faixa informada e o que o funil gera.
    let cruzamento = null;
    if (hoje !== null && faixa && FAIXAS[faixa]) {
      const [min, max] = FAIXAS[faixa];
      if (hoje < min * 0.95) cruzamento = `Você informou faturamento de ${faixa.replace("Até ", "até ")}, mas o funil dos contatos novos gera cerca de ${mil(hoje)}. A diferença costuma vir de indicação e da base de pacientes, um canal que dá para medir e fazer crescer.`;
      else if (hoje > max * 1.1) cruzamento = `O funil dos contatos novos soma cerca de ${mil(hoje)}, acima da faixa que você informou (${faixa}). Vale conferir as taxas com calma na reunião: às vezes o fechamento ou o valor médio estão acima do real.`;
    }

    const alertas = [];
    if (P === null) alertas.push(["Você não mede o comparecimento.", "Sem esse número, as faltas passam despercebidas. Para a estimativa, usamos a média do mercado."]);
    if (F === null) alertas.push(["Você não mede o fechamento.", "É o número que mais pesa no faturamento. Para a estimativa, usamos a média do mercado."]);
    if (q6 === 2) alertas.push(["Primeira resposta no mesmo dia.", "Quem responde em até 1 hora tem quase 7 vezes mais chance de converter o contato."]);
    if (q6 === 3) alertas.push(["Primeira resposta no dia seguinte.", "Quem responde em até 1 hora tem quase 7 vezes mais chance de converter o contato."]);
    const a7 = [
      ["O preço vira a principal objeção.", "Sinal de que o valor do tratamento não ficou claro antes do preço."],
      ["O paciente sai para comparar preço.", "Sinal de que o valor do plano não ficou claro na avaliação."],
      ["O paciente sai para pensar.", "Sem uma pergunta sobre o que falta para decidir, a decisão fica com ele."],
      ["Quem decide não estava na avaliação.", "A decisão sai da sala junto com o paciente."],
      ["O receio do tratamento não foi respondido.", "Sem resposta para a dúvida, o paciente adia."],
      ["O paciente deixa para começar depois.", "Sem uma data combinada, o \"depois\" costuma esfriar."],
      ["O paciente some depois do orçamento.", "Falta acompanhamento logo após a avaliação."],
    ][q7];
    if (a7) alertas.push(a7);
    const a8 = [
      ["Orçamentos sem nenhum retorno.", "Quem não fechou na hora dificilmente volta sozinho."],
      ["Retorno só quando o paciente chama.", "Quem não fechou na hora dificilmente volta sozinho."],
      ["Só uma tentativa de retorno.", "Uma mensagem só costuma não ser suficiente para retomar a decisão."],
      ["Retorno sem rotina definida.", "As tentativas dependem da memória de alguém, e muitos orçamentos ficam sem contato."],
    ][q8];
    if (a8) alertas.push(a8);

    // Situação das 6 etapas (relatório).
    const sit = (t) => ({ ok: "Ok", atencao: "Atenção", critico: "Crítico", sem: "Sem referência", nao: "Não medido" })[t];
    const status = [
      { nome: "Primeira resposta", leitura: q6 === 4 ? "Não sabe o tempo da primeira resposta" : "Resposta " + QUESTOES[5].o[q6].toLowerCase(), s: q6 === 4 ? "nao" : q6 <= 1 ? "ok" : q6 === 2 ? "atencao" : "critico" },
      { nome: "Agendamento", leitura: A === null ? "Não sabe quantos agendam" : `${pct(A)} dos contatos agendam`, s: A === null ? "nao" : "sem" },
      { nome: "Comparecimento", leitura: P === null ? "Não sabe quantos comparecem" : `${pct(P)} comparecem · média 77%`, s: P === null ? "nao" : P >= mP ? "ok" : P >= 0.6 ? "atencao" : "critico" },
      { nome: "Orçamento", leitura: q7 === 8 ? "Não sabe por que o paciente não fecha" : QUESTOES[6].o[q7], s: q7 === 8 ? "nao" : (q7 === 0 || q7 === 1) ? "atencao" : "ok" },
      { nome: "Fechamento", leitura: F === null ? "Não sabe quantos fecham" : `${pct(F)} fecham · média 42%`, s: F === null ? "nao" : F >= mF ? "ok" : F >= 0.3 ? "atencao" : "critico" },
      { nome: "Retorno", leitura: QUESTOES[7].o[q8], s: q8 === 5 ? "nao" : q8 <= 1 ? "critico" : q8 <= 3 ? "atencao" : "ok" },
    ].map((x) => ({ ...x, situacao: sit(x.s) }));

    const info = etapa === "naomede" ? NAO_MEDE : ETAPAS[etapa];
    return {
      etapa,
      etapaNome: info.nome,
      naoMede,
      notionEtapa: info.nome,
      abertura,
      estimativa: modo === "top" ? null : estimativa,
      estimativaTexto: estimativa !== null && modo !== "top" ? texto(estimativa) : null,
      modo, ganhoTop, hoje, naMedia, ganhoComp, ganhoFech,
      aumento: hoje && naMedia ? naMedia / hoje - 1 : null,
      faturamento: hoje,
      estimadas, funil, comparacoes, cruzamento, status,
      alertas: alertas.slice(0, 3),
      semana: SEMANA[etapa],
      plano: PLANO[etapa],
      ferramenta: info.ferramenta, ferramentaHtml: info.html,
    };
  }

  function respostasTexto(a, outroTexto) {
    return QUESTOES.map((q, i) => {
      let r = q.o[a[i]];
      if (q.outro === a[i] && outroTexto) r += `: ${outroTexto}`;
      return `${i + 1}. ${q.p} ${r}`;
    }).join("\n");
  }

  window.RU = { QUESTOES, ETAPAS, NAO_MEDE, REF, FAIXAS, calcular, validar, respostasTexto, texto, mil, pct };
  if (typeof module !== "undefined") module.exports = window.RU;
})();
