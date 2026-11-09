// Funções compartilhadas entre as páginas.
(function () {
  const params = new URLSearchParams(location.search);

  function lerLocal(chave) {
    try { return localStorage.getItem(chave); } catch (e) { return null; }
  }
  function gravarLocal(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (e) {}
  }

  // Lead atual: vem da URL (?l=) ou do que ficou salvo na captura.
  function lead() {
    const l = params.get("l");
    if (l) { gravarLocal("ru_lead", l); return l; }
    return lerLocal("ru_lead");
  }

  // Responsável pelo link (1 = normal, 2 = link com ?v=2).
  // A página de captura sempre regrava; as outras usam o link e, sem ele, o que ficou salvo.
  function vendedor() {
    const v = params.get("v");
    if (v === "1" || v === "2") { gravarLocal("ru_v", v); return v; }
    return lerLocal("ru_v") === "2" ? "2" : "1";
  }

  function linkComLead(href) {
    const l = lead();
    const v = vendedor();
    if (!l && v !== "2") return href;
    const u = new URL(href, location.href);
    if (l) u.searchParams.set("l", l);
    if (v === "2") u.searchParams.set("v", "2");
    return u.pathname + u.search + u.hash;
  }

  function ativarCopiar(raiz) {
    (raiz || document).querySelectorAll(".script .copy").forEach((b) => {
      b.addEventListener("click", async () => {
        const t = b.parentElement.querySelector("p").innerText;
        try { await navigator.clipboard.writeText(t); } catch (e) {}
        const antes = b.textContent;
        b.textContent = "Copiado";
        setTimeout(() => (b.textContent = antes), 1600);
      });
    });
  }

  function revelar() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.2 });
    els.forEach((e) => io.observe(e));
  }

  function baixarPlanilha() {
    const cab = ["Paciente", "WhatsApp", "Data do orçamento", "Tratamento", "Valor", "Motivo de não ter fechado", "Último contato", "Próximo contato", "Situação", "Observações"];
    const csv = "﻿" + cab.join(";") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "orcamentos-parados.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Barra fina no topo enquanto a próxima página carrega.
  function carregamento() {
    const b = document.createElement("div");
    b.id = "carregando";
    document.body.appendChild(b);
    document.addEventListener("click", (ev) => {
      const l = ev.target.closest("a[href]");
      if (!l || l.target === "_blank" || l.hasAttribute("download") || ev.metaKey || ev.ctrlKey) return;
      const u = new URL(l.href, location.href);
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return;
      b.classList.add("on");
    });
    addEventListener("pageshow", () => b.classList.remove("on"));
  }
  if (document.body) carregamento(); else addEventListener("DOMContentLoaded", carregamento);

  window.RUApp = { params, lead, vendedor, linkComLead, ativarCopiar, revelar, baixarPlanilha, lerLocal, gravarLocal };
})();
