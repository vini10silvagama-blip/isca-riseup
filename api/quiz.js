// Recebe o resultado do quiz e atualiza a linha do lead no Notion.
import { notion, baseId, hoje, texto, selecao, data, lerCorpo } from "./_notion.js";

const ETAPAS = ["Primeira resposta", "Agendamento", "Comparecimento", "Orçamento", "Fechamento", "Retorno", "Não mede o funil"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });
  const b = lerCorpo(req);

  const lead = String(b.lead || "").replace(/-/g, "");
  if (!/^[0-9a-f]{32}$/i.test(lead) || !ETAPAS.includes(b.etapa)) return res.status(400).json({ erro: "Dados inválidos" });

  let resultado = String(b.resultado || "");
  try { const u = new URL(resultado); if (!/^https?:$/.test(u.protocol)) resultado = ""; } catch (e) { resultado = ""; }

  try {
    // Só atualiza páginas que pertencem à base da isca.
    const pagina = await notion(`/pages/${lead}`);
    if ((pagina.parent?.database_id || "").replace(/-/g, "") !== baseId()) return res.status(403).json({ erro: "Lead inválido" });

    const props = {
      "Data do quiz": data(hoje()),
      "Etapa mais fraca": selecao(b.etapa),
      "Respostas do quiz": texto(String(b.respostas || "")),
      "Próximo toque": data(hoje()),
      "Estimativa mensal": { number: Number.isFinite(b.estimativa) ? Math.max(0, Math.round(b.estimativa)) : null },
    };
    if (resultado) props["Resultado do quiz"] = { url: resultado.slice(0, 2000) };

    await notion(`/pages/${lead}`, "PATCH", { properties: props });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Falha ao gravar" });
  }
}
