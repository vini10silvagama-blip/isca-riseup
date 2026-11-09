// Verificação rápida da ligação com o Notion. Abra /api/status no navegador.
// Não mostra as chaves, só se existem e se as bases estão acessíveis.
import { conta } from "./_notion.js";

async function testar(v, chave, base) {
  const r = { chave_configurada: Boolean(process.env[chave]), base_configurada: Boolean(process.env[base]), acesso_a_base: "não testado" };
  if (r.chave_configurada && r.base_configurada) {
    const c = conta(v);
    try { await c.notion(`/databases/${c.baseId()}`); r.acesso_a_base = "ok"; } catch (e) { r.acesso_a_base = e.message; }
  }
  return r;
}

export default async function handler(req, res) {
  const r = {
    conta_1: await testar("1", "NOTION_TOKEN", "NOTION_DATABASE_ID"),
    conta_2: await testar("2", "NOTION_TOKEN_2", "NOTION_DATABASE_ID_2"),
  };
  if (!r.conta_2.chave_configurada || !r.conta_2.base_configurada) r.conta_2.observacao = "Ainda não configurada: os leads do link 2 vão para a conta 1, marcados como Link 2.";
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(r);
}
