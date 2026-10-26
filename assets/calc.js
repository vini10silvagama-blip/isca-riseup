// Perguntas, regra de cálculo e textos do mini diagnóstico.
(function () {
  const QUESTOES = [
    { etapa: "Contatos", p: "Quantos contatos novos chegam por mês (WhatsApp, Instagram, ligação)?", o: ["Até 30", "31 a 60", "61 a 100", "101 a 200", "Mais de 200", "Não sei"], v: [20, 45, 80, 150, 250, null] },
    { etapa: "Agendamento", p: "De cada 10 contatos, quantos agendam avaliação?", o: ["Até 2", "3 a 4", "5 a 6", "7 ou mais", "Não sei"], v: [0.2, 0.35, 0.55, 0.75, null] },
    { etapa: "Comparecimento", p: "De cada 10 agendados, quantos comparecem?", o: ["Até 4", "5 a 6", "7 a 8", "9 ou 10", "Não sei"], v: [0.35, 0.55, 0.75, 0.9, null] },
    { etapa: "Fechamento", p: "De cada 10 orçamentos apresentados, quantos fecham?", o: ["Até 2", "3 a 4", "5 a 6", "7 ou mais", "Não sei"], v: [0.2, 0.35, 0.55, 0.75, null] },
    { etapa: "Valor do tratamento", p: "Qual o valor médio de um tratamento fechado?", o: ["Até R$ 3 mil", "R$ 3 a 8 mil", "R$ 8 a 15 mil", "R$ 15 a 30 mil", "Acima de R$ 30 mil", "Não sei"], v: [2000, 5500, 11500, 22500, 35000, null] },
    { etapa: "Primeira resposta", p: "Quanto tempo leva a primeira resposta a um contato novo?", o: ["Em minutos", "Em até 1 hora", "No mesmo dia", "No dia seguinte ou depois", "Não sei"] },
    { etapa: "Fechamento", p: "Quando o paciente não fecha, o que mais acontece?", o: ["Diz que achou caro", "Diz que vai pensar ou falar com alguém", "Some sem responder", "Não sei"] },
    { etapa: "Retorno", p: "O que acontece com o orçamento que não fecha na hora?", o: ["Ninguém retorna", "Uma tentativa de contato", "Rotina definida de retornos", "Não sei"] },
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

  const NAO_MEDE = {
    nome: "Não mede o funil",
    explicacao: "Sem saber quantos agendam, comparecem e fecham, não dá para saber onde está a perda. O primeiro passo é medir.",
  };

  function valor(a, i) {
    const q = QUESTOES[i];
    return q.v ? q.v[a[i]] ?? null : null;
  }

  function texto(v) {
    const k = Math.round(v / 1000);
    return k < 1 ? "menos de R$ 1 mil" : `cerca de R$ ${k.toLocaleString("pt-BR")} mil`;
  }

  function validar(a) {
    return Array.isArray(a) && a.length === QUESTOES.length && a.every((x, i) => Number.isInteger(x) && x >= 0 && x < QUESTOES[i].o.length);
  }

  function calcular(a) {
    const C = valor(a, 0), A = valor(a, 1), P = valor(a, 2), F = valor(a, 3), T = valor(a, 4);
    const q6 = a[5], q7 = a[6], q8 = a[7];

    // Ordem de desempate: mais perto do fechamento primeiro.
    const taxas = [["fechamento", F], ["comparecimento", P], ["agendamento", A]];
    const conhecidas = taxas.filter((t) => t[1] !== null);
    const naoAvaliadas = taxas.filter((t) => t[1] === null).map((t) => ({ fechamento: "Fechamento", comparecimento: "Comparecimento", agendamento: "Agendamento" })[t[0]]);
    const naoMede = conhecidas.length < 2;

    let etapa;
    if (naoMede) {
      if (q6 === 3) etapa = "primeira";
      else if (q8 === 0) etapa = "retorno";
      else if (q7 === 1) etapa = "fechamento";
      else if (q7 === 0) etapa = "orcamento";
      else etapa = "primeira";
    } else {
      const ponto = conhecidas.reduce((m, t) => (t[1] < m[1] ? t : m))[0];
      if (ponto === "agendamento") etapa = q6 === 2 || q6 === 3 ? "primeira" : "agendamento";
      else if (ponto === "comparecimento") etapa = "comparecimento";
      else if (q7 === 0) etapa = "orcamento";
      else if (q7 === 1) etapa = "fechamento";
      else if (q7 === 2) etapa = "retorno";
      else etapa = q8 === 0 || q8 === 1 ? "retorno" : "fechamento";
    }

    let estimativa = null, ranking = [], funil = null, faturamento = null;
    const tudo = [C, A, P, F, T].every((x) => x !== null);
    if (tudo) {
      const base = C * A * P * F * T;
      faturamento = base;
      const ganho = (r) => {
        const m = { agendamento: A, comparecimento: P, fechamento: F };
        const novo = Math.min(m[r] + 0.1, 0.95);
        return base * (novo / m[r]) - base;
      };
      ranking = [
        { nome: "Fechamento", chave: "fechamento", valor: ganho("fechamento") },
        { nome: "Agendamento", chave: "agendamento", valor: ganho("agendamento") },
        { nome: "Comparecimento", chave: "comparecimento", valor: ganho("comparecimento") },
      ].sort((x, y) => y.valor - x.valor);
      if (!naoMede) {
        const pontoChave = conhecidas.reduce((m, t) => (t[1] < m[1] ? t : m))[0];
        estimativa = ranking.find((r) => r.chave === pontoChave).valor;
      }
    }
    if (C !== null && A !== null && P !== null && F !== null) {
      funil = [
        { rotulo: "Contatos", n: C },
        { rotulo: "Agendados", n: Math.round(C * A) },
        { rotulo: "Compareceram", n: Math.round(C * A * P) },
        { rotulo: "Fecharam", n: Math.round(C * A * P * F) },
      ];
    }

    const alertas = [];
    if (q6 === 2) alertas.push(["Primeira resposta no mesmo dia.", "Para quem pesquisa várias clínicas, horas de espera já são tempo suficiente para fechar com outra."]);
    if (q6 === 3) alertas.push(["Primeira resposta no dia seguinte.", "Parte dos contatos esfria antes de ser atendida."]);
    if (q7 === 0) alertas.push(["O preço vira a principal objeção.", "Sinal de que o valor do tratamento não ficou claro antes do preço."]);
    if (q7 === 1) alertas.push(["O paciente sai para pensar.", "Sem uma pergunta sobre o que falta, a decisão fica com ele."]);
    if (q7 === 2) alertas.push(["O paciente some depois do orçamento.", "Falta acompanhamento logo após a avaliação."]);
    if (q8 === 0) alertas.push(["Orçamentos sem nenhum retorno.", "Quem não fechou na hora dificilmente volta sozinho."]);
    if (q8 === 1) alertas.push(["Só uma tentativa de retorno.", "Uma mensagem só costuma não ser suficiente para retomar a decisão."]);

    return {
      etapa,
      etapaNome: ETAPAS[etapa].nome,
      naoMede,
      notionEtapa: naoMede ? NAO_MEDE.nome : ETAPAS[etapa].nome,
      estimativa,
      estimativaTexto: estimativa !== null ? texto(estimativa) : null,
      faturamento,
      ranking,
      funil,
      naoAvaliadas,
      alertas: alertas.slice(0, 3),
    };
  }

  function respostasTexto(a) {
    return QUESTOES.map((q, i) => `${i + 1}. ${q.p} ${q.o[a[i]]}`).join("\n");
  }

  window.RU = { QUESTOES, ETAPAS, NAO_MEDE, calcular, validar, respostasTexto, texto };
  if (typeof module !== "undefined") module.exports = window.RU;
})();
