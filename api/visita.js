// Registra que o lead da prospecção abriu o link da captura (?c=RU-27).
// Só grava a data em "Abriu o link"; não muda Etapa nem Próximo toque.
// Quem já preencheu a captura não é atualizado (o registro já está na Data da captura).
import { notion, buscar, hoje, data, lerCorpo } from "./_notion.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido" });
  const b = lerCorpo(req);
  const numero = Number(String(b.codigo || "").replace(/\D/g, ""));
  if (!numero) return res.status(400).json({ erro: "Código inválido" });

  try {
    const pagina = await buscar({ property: "Código", unique_id: { equals: numero } });
    if (!pagina) return res.status(404).json({ erro: "Lead não encontrado" });
    if (pagina.properties?.["Data da captura"]?.date?.start) return res.status(200).json({ ok: true, ignorado: true });

    await notion(`/pages/${pagina.id}`, "PATCH", { properties: { "Abriu o link": data(hoje()) } });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Falha ao gravar" });
  }
}
