// Pedido do relatório completo, feito no botão do resultado.
// Grava a data em "Pediu o relatório", guarda o link do relatório nas Observações,
// deixa o lead na visão "Hoje" e avisa o Vinicius no Notion.
import { notion, baseId, hoje, data, lerCorpo, somarObservacao, avisar } from "./_notion.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });
  const b = lerCorpo(req);

  const lead = String(b.lead || "").replace(/-/g, "");
  if (!/^[0-9a-f]{32}$/i.test(lead)) return res.status(400).json({ erro: "Dados inválidos" });

  // Só aceita o link do relatório, sempre montado com o endereço deste site.
  let relatorio = "";
  try {
    const u = new URL(String(b.relatorio || ""));
    const host = String(req.headers?.host || "riseup-diagnostico.vercel.app").replace(/[^a-z0-9.:-]/gi, "");
    if (u.pathname === "/relatorio") relatorio = `https://${host}/relatorio${u.search}`.slice(0, 1500);
  } catch (e) {}

  try {
    const pagina = await notion(`/pages/${lead}`);
    if ((pagina.parent?.database_id || "").replace(/-/g, "") !== baseId()) return res.status(403).json({ erro: "Lead inválido" });

    const props = { "Pediu o relatório": data(hoje()), "Próximo toque": data(hoje()) };
    if (relatorio) props["Observações"] = somarObservacao(pagina, `Pediu o relatório ${hoje()}: ${relatorio}`);
    await notion(`/pages/${lead}`, "PATCH", { properties: props });

    const clinica = (pagina.properties?.["Clínica"]?.title || []).map((t) => t.plain_text || "").join("") || "Lead";
    const zap = pagina.properties?.WhatsApp?.url || "";
    await avisar(lead, `Pediu o relatório completo: ${clinica}. Abrir o relatório, salvar em PDF e enviar no WhatsApp${zap ? ` (${zap})` : ""}: ${relatorio || "link não recebido"}`);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Falha ao gravar" });
  }
}
