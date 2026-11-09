// Acesso às bases de leads no Notion.
// Conta 1 (link normal): NOTION_TOKEN, NOTION_DATABASE_ID e NOTION_AVISAR_USUARIO.
// Conta 2 (link com ?v=2): NOTION_TOKEN_2, NOTION_DATABASE_ID_2 e NOTION_AVISAR_USUARIO_2.
// Enquanto a conta 2 não estiver configurada, os leads do link 2 vão para a conta 1, marcados como "Link 2".

const API = "https://api.notion.com/v1";
const VERSAO = "2022-06-28";

const CONTAS = {
  1: { token: () => process.env.NOTION_TOKEN, base: () => process.env.NOTION_DATABASE_ID, avisar: () => process.env.NOTION_AVISAR_USUARIO || "10cd74c4-690b-42e5-b20f-eadc4a102cef" },
  2: { token: () => process.env.NOTION_TOKEN_2, base: () => process.env.NOTION_DATABASE_ID_2, avisar: () => process.env.NOTION_AVISAR_USUARIO_2 || "" },
};

// Conta do pedido atual. Cada função da API chama conta(b.v) e usa o que ela devolve.
export function conta(v) {
  const n = String(v || "") === "2" ? 2 : 1;
  const c = CONTAS[n];
  const pronta = Boolean(c.token() && c.base());
  const usada = n === 2 && !pronta ? CONTAS[1] : c;
  const marca = n === 2 && !pronta ? "[Link 2 · Felipe] " : "";
  const token = usada.token();
  const base = (usada.base() || "").replace(/-/g, "");
  const chamar = (caminho, metodo, corpo) => notionCom(token, caminho, metodo, corpo);
  return {
    numero: n,
    marca,
    notion: chamar,
    baseId: () => base,
    buscar: async (filtro) => {
      const d = await chamar(`/databases/${base}/query`, "POST", { filter: filtro, page_size: 1 });
      return d.results && d.results[0] ? d.results[0] : null;
    },
    avisar: (paginaId, mensagem) => avisarCom(chamar, usada.avisar(), paginaId, marca + mensagem),
  };
}

function cabecalhos(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": VERSAO,
    "Content-Type": "application/json",
  };
}

async function notionCom(token, caminho, metodo = "GET", corpo) {
  const r = await fetch(API + caminho, {
    method: metodo,
    headers: cabecalhos(token),
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

// Data de hoje no fuso da Bahia, no formato AAAA-MM-DD.
export function hoje() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bahia" }).format(new Date());
}

export const texto = (t) => ({ rich_text: [{ text: { content: String(t).slice(0, 2000) } }] });
export const titulo = (t) => ({ title: [{ text: { content: String(t).slice(0, 200) } }] });
export const selecao = (t) => ({ select: { name: t } });
export const data = (d) => ({ date: { start: d } });

// Aviso no Notion: um comentário na linha do lead mencionando a pessoa da conta,
// o que dispara a notificação do Notion. Sem pessoa definida, o comentário sai sem menção.
// Se o comentário falhar, a captura e o quiz seguem normalmente.
// Sem pessoa definida na Vercel: se a conta do Notion tiver uma única pessoa, ela é avisada.
// Precisa da permissão "Ler informações do usuário" na integração.
async function pessoaUnica(chamar) {
  try {
    const d = await chamar("/users?page_size=100");
    const pessoas = (d.results || []).filter((u) => u.type === "person");
    return pessoas.length === 1 ? pessoas[0].id : "";
  } catch (e) {
    return "";
  }
}

async function avisarCom(chamar, usuario, paginaId, mensagem) {
  try {
    if (!usuario) usuario = await pessoaUnica(chamar);
    const partes = [];
    if (usuario) partes.push({ type: "mention", mention: { user: { id: usuario } } });
    partes.push({ type: "text", text: { content: ` ${mensagem}`.slice(0, 1900) } });
    await chamar("/comments", "POST", { parent: { page_id: paginaId }, rich_text: partes });
  } catch (e) {
    console.error("Aviso não enviado:", e.message);
  }
}

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
