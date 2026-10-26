// Recebe a página de captura e grava o lead no Notion.
// Se o link tiver o código do lead (?c=RU-27) ou o WhatsApp já existir, atualiza a linha.
// Caso contrário, cria uma linha nova.
import { notion, buscar, baseId, hoje, texto, titulo, selecao, data, lerCorpo } from "./_notion.js";

const FAIXAS = ["Até R$ 70 mil", "R$ 70 a 150 mil", "Acima de R$ 150 mil"];
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
      Decisor: texto(nome),
      "E-mail": { email },
      "Faixa de faturamento": selecao(faixa),
      "Consentimento LGPD": { checkbox: true },
      "Data da captura": data(hoje()),
      "Próximo toque": data(hoje()),
    };

    if (pagina) {
      const props = { ...comuns };
      if (!pagina.properties?.WhatsApp?.url) props.WhatsApp = { url: whatsapp };
      if (!pagina.properties?.Origem?.select) props.Origem = selecao(origem);
      await notion(`/pages/${pagina.id}`, "PATCH", { properties: props });
      return res.status(200).json({ lead: pagina.id });
    }

    const nova = await notion("/pages", "POST", {
      parent: { database_id: baseId() },
      properties: {
        ...comuns,
        "Clínica": titulo(clinica),
        WhatsApp: { url: whatsapp },
        Origem: selecao(origem),
        Etapa: { status: { name: "Novo" } },
      },
    });
    return res.status(200).json({ lead: nova.id });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Falha ao gravar" });
  }
}
