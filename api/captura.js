// Recebe a página de captura e grava o lead no Notion.
// Se o link tiver o código do lead (?c=RU-27) ou o WhatsApp já existir, atualiza a linha.
// Caso contrário, cria uma linha nova.
import { notion, buscar, baseId, hoje, texto, titulo, selecao, data, lerCorpo, etapaRespondeu, somarObservacao, avisar } from "./_notion.js";

const FAIXAS = ["Até R$ 30 mil", "R$ 30 a 50 mil", "R$ 50 a 70 mil", "R$ 70 a 100 mil", "R$ 100 a 150 mil", "R$ 150 a 300 mil", "Acima de R$ 300 mil"];
const ORIGENS = ["Prospecção", "Instagram", "Anúncio"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });
  const b = lerCorpo(req);

  const nome = String(b.nome || "").trim().slice(0, 80);
  const clinica = String(b.clinica || "").trim().slice(0, 120);
  const email = String(b.email || "").trim().slice(0, 120);
  const faixa = FAIXAS.includes(b.faixa) ? b.faixa : null;
  const origem = ORIGENS.includes(b.origem) ? b.origem : "Instagram";
  let digitos = String(b.whatsapp || "").replace(/\D/g, "");
  if (digitos.length === 10 || digitos.length === 11) digitos = "55" + digitos;

  if (!nome || !clinica || digitos.length < 12 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !faixa || b.consentimento !== true) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }
  const whatsapp = `https://wa.me/${digitos}`;

  try {
    let pagina = null;
    const numero = Number(String(b.codigo || "").replace(/\D/g, ""));
    if (numero) pagina = await buscar({ property: "Código", unique_id: { equals: numero } });
    if (!pagina) pagina = await buscar({ property: "WhatsApp", url: { equals: whatsapp } });

    const comuns = {
      "E-mail": { email },
      "Faixa de faturamento": selecao(faixa),
      "Consentimento LGPD": { checkbox: true },
      "Data da captura": data(hoje()),
      "Próximo toque": data(hoje()),
    };

    if (pagina) {
      // Lead que já existe: o Decisor encontrado na prospecção não é trocado.
      // Quem preencheu fica registrado nas Observações.
      const props = { ...comuns, "Observações": somarObservacao(pagina, `Captura ${hoje()}: preenchido por ${nome}.`) };
      const etapa = etapaRespondeu(pagina);
      if (etapa) props.Etapa = etapa;
      if (!pagina.properties?.WhatsApp?.url) props.WhatsApp = { url: whatsapp };
      if (!pagina.properties?.Origem?.select) props.Origem = selecao(origem);
      await notion(`/pages/${pagina.id}`, "PATCH", { properties: props });
      await avisar(pagina.id, `Nova captura: ${nome} (${clinica}) preencheu a página do guia. Enviar o PDF por WhatsApp ou e-mail: ${whatsapp} · ${email}`);
      return res.status(200).json({ lead: pagina.id });
    }

    const nova = await notion("/pages", "POST", {
      parent: { database_id: baseId() },
      properties: {
        ...comuns,
        Decisor: texto(nome),
        "Clínica": titulo(clinica),
        WhatsApp: { url: whatsapp },
        Origem: selecao(origem),
        Etapa: { status: { name: "Respondeu" } },
      },
    });
    await avisar(nova.id, `Lead novo pela captura (${origem}): ${nome} (${clinica}). Enviar o PDF por WhatsApp ou e-mail: ${whatsapp} · ${email}`);
    return res.status(200).json({ lead: nova.id });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Falha ao gravar" });
  }
}
