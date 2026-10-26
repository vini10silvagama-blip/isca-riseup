// Verificação rápida da ligação com o Notion. Abra /api/status no navegador.
// Não mostra a chave, só se ela existe e se a base está acessível.
import { notion, baseId } from "./_notion.js";

export default async function handler(req, res) {
  const r = {
    chave_configurada: Boolean(process.env.NOTION_TOKEN),
    base_configurada: Boolean(baseId()),
    acesso_a_base: "não testado",
  };
  if (r.chave_configurada && r.base_configurada) {
    try {
      await notion(`/databases/${baseId()}`);
      r.acesso_a_base = "ok";
    } catch (e) {
      r.acesso_a_base = e.message;
    }
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(r);
}
