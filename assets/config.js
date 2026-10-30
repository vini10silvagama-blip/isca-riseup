// Configurações gerais das páginas. Altere aqui sem mexer no resto do código.
window.RU_CONFIG = {
  // WhatsApp que recebe os pedidos de reunião (só números, com 55 e DDD).
  whatsappAgenda: "5577981631559",

  // Mensagem que o lead envia ao clicar em "Agendar diagnóstico gratuito".
  // [clinica] e [etapa] são trocados pelo nome da clínica e pela etapa mais fraca.
  mensagemAgenda: "Olá! Fiz o diagnóstico da [clinica]. Etapa mais fraca: [etapa]. Quero agendar a reunião para entender o resultado.",

  // Monta o link do botão. Sem o nome da clínica, a mensagem fica sem ele.
  agendaUrl(clinica, etapa) {
    let t = this.mensagemAgenda.replace("[etapa]", etapa || "");
    t = clinica ? t.replace("[clinica]", clinica) : t.replace(" da [clinica]", " da minha clínica");
    return `https://wa.me/${this.whatsappAgenda}?text=${encodeURIComponent(t)}`;
  },
};
