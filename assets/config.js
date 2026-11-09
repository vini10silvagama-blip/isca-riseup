// Configurações gerais das páginas. Altere aqui sem mexer no resto do código.
window.RU_CONFIG = {
  // Responsável por cada link. O link normal é o 1; o link com ?v=2 é o 2.
  // whatsapp: só números, com 55 e DDD. nome: aparece no relatório em PDF.
  contas: {
    1: { nome: "Vinicius Gama", whatsapp: "5577981631559" },
    2: { nome: "Felipe Costa", whatsapp: "5577981124410" },
  },

  conta(v) {
    return this.contas[String(v) === "2" ? 2 : 1];
  },

  // Mensagem que o lead envia ao clicar em "Quero aprofundar meu diagnóstico".
  // [clinica] e [etapa] são trocados pelo nome da clínica e pela etapa mais fraca.
  mensagemAgenda: "Olá! Fiz o diagnóstico da [clinica]. Etapa mais fraca: [etapa]. Quero aprofundar o diagnóstico na reunião.",

  // Monta o link do botão. Sem o nome da clínica, a mensagem fica sem ele.
  agendaUrl(clinica, etapa, v) {
    let t = this.mensagemAgenda.replace("[etapa]", etapa || "");
    t = clinica ? t.replace("[clinica]", clinica) : t.replace(" da [clinica]", " da minha clínica");
    return `https://wa.me/${this.conta(v).whatsapp}?text=${encodeURIComponent(t)}`;
  },
};
