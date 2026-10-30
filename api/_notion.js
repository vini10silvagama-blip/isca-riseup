// Acesso à base "Prospecção - Rise Up" no Notion.
// Variáveis de ambiente na Vercel: NOTION_TOKEN e NOTION_DATABASE_ID.

const API = "https://api.notion.com/v1";
const VERSAO = "2022-06-28";

function cabecalhos() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Notion-Version": VERSAO,
    "Content-Type": "application/json",
  };
}

export function baseId() {
  return (process.env.NOTION_DATABASE_ID || "").replace(/-/g, "");
}

export async function notion(caminho, metodo = "GET", corpo) {
  const r = await fetch(API + caminho, {
    method: metodo,
    headers: cabecalhos(),
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const dados = await r.json().catch(() => ({}));
  if (!r.ok) {
    const erro = new Error(`Notion ${r.status}: ${dados.message || "erro"}`);
    erro.status = r.status;
    throw erro;
  }
  return dados;
}

export async function buscar(filtro) {
  const d = await notion(`/databases/${baseId()}/query`, "POST", { filter: filtro, page_size: 1 });
  return d.results && d.results[0] ? d.results[0] : null;
}

// Data de hoje no fuso da Bahia, no formato AAAA-MM-DD.
export function hoje() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bahia" }).format(new Date());
}

export const texto = (t) => ({ rich_text: [{ text: { content: String(t).slice(0, 2000) } }] });
export const titulo = (t) => ({ title: [{ text: { content: String(t).slice(0, 200) } }] });
export const selecao = (t) => ({ select: { name: t } });
export const data = (d) => ({ date: { start: d } });

// Etapas que mudam para "Respondeu" quando o lead faz a captura ou o quiz.
// Reunião marcada, Proposta e Fechado ficam como estão.
const ETAPAS_QUE_AVANCAM = ["Novo", "Toque 1", "Toque 2", "Toque 3", "Toque 4", "Toque 5", "Reciclar em 90 dias", "Perdido"];

export function etapaRespondeu(pagina) {
  const atual = pagina?.properties?.Etapa?.status?.name || "Novo";
  return ETAPAS_QUE_AVANCAM.includes(atual) ? { status: { name: "Respondeu" } } : null;
}

// Junta um texto novo às Observações que já existem, sem apagar nada.
export function somarObservacao(pagina, linha) {
  const atual = (pagina?.properties?.["Observações"]?.rich_text || []).map((t) => t.plain_text || "").join("");
  return texto(atual ? `${atual}\n${linha}` : linha);
}

export function lerCorpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch (e) { return {}; }
}
