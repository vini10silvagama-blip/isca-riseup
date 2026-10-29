import html, sys
Q="https://riseup-diagnostico.vercel.app/quiz"
E=[
 dict(nome="Primeira resposta", sinal="Contato da noite só é respondido no dia seguinte.", ferr="Kit de primeiras mensagens",
  script="Olá, [nome]! Aqui é a [atendente], da [clínica]. Vi que você se interessou por [procedimento]. Para eu te orientar melhor: é a primeira vez que você busca esse tratamento ou já fez alguma avaliação?",
  antes=[("d","Ontem"),("p","Oi, boa noite! Queria saber sobre o tratamento","21:40"),("d","Hoje"),("c","Bom dia! Segue nossa tabela de valores.","10:15"),("s","Visualizado. Sem resposta.")],
  depois=[("d","Hoje"),("p","Oi, boa noite! Queria saber sobre o tratamento","21:40"),("c","Olá, Ana! Aqui é a Júlia, da clínica. É a primeira vez que você busca esse tratamento ou já fez alguma avaliação?","21:43"),("p","É a primeira vez! Queria entender como funciona","21:45")],
  passos=["Responder em minutos","Abrir com pergunta","Fechar com pergunta"]),
 dict(nome="Agendamento", sinal="Muita conversa e pouca avaliação marcada.", ferr="Sequência até a avaliação",
  script="Faz sentido querer saber o valor, [nome]. Ele depende do seu caso, e é na avaliação que o(a) Dr(a). [nome] define o que você precisa. Tenho horário [dia] às [hora] ou [dia] às [hora]. Qual fica melhor?",
  antes=[("d","Hoje"),("p","Quanto custa?","14:02"),("c","A partir de R$ [valor].","14:05"),("s","Visualizado. Sem resposta.")],
  depois=[("d","Hoje"),("p","Quanto custa?","14:02"),("c","Faz sentido querer saber, Ana. O valor depende do seu caso, e a Dra. Paula define isso na avaliação. Tenho quinta às 10h ou sexta às 15h. Qual fica melhor?","14:04"),("p","Quinta às 10h","14:06"),("c","Pronto, ficou marcado! Te mando a confirmação na véspera.","14:06")],
  passos=["Reconhecer a pergunta","Explicar a avaliação","Oferecer 2 horários"]),
 dict(nome="Comparecimento", sinal="Buracos na agenda, sem aviso do paciente.", ferr="Mensagens de confirmação", script=None,
  antes=[("d","Ontem"),("c","Lembrando da sua consulta amanhã às 14h.","18:30"),("d","Hoje"),("s","14:00 · Paciente não apareceu.")],
  depois=[("d","Ontem"),("c","Oi, Ana! Confirmando sua avaliação amanhã, quinta, às 14h. Responde 1 para confirmar ou 2 se precisar remarcar.","18:30"),("p","1","18:41"),("c","Perfeito, te esperamos! O endereço é [endereço].","18:42")],
  passos=["Confirmar no agendamento","Lembrar na véspera e no dia","Remarcar quem faltou"]),
 dict(nome="Orçamento", sinal="O paciente ouve o valor e compara só preço.", ferr='Roteiro "valor antes do preço"', script=None,
  antes=[("d","Hoje"),("c","Oi, Ana! Segue o orçamento: R$ [valor].","16:20"),("p","Vou ver e te aviso","17:05"),("s","Sem retorno.")],
  depois=[("d","Hoje"),("c","Ana, como conversamos: o que mais te incomoda hoje é [queixa]. O plano da Dra. Paula resolve isso em [prazo].","16:20"),("p","Isso! E qual o valor?","16:24"),("c","Fica em R$ [valor], e dá para parcelar em [formas]. Podemos começar dia [data]?","16:25")],
  passos=["Retomar a queixa","Mostrar o plano","Só então o valor"]),
 dict(nome="Fechamento", sinal='O "vou pensar" encerra a conversa.', ferr='Script do "vou pensar"', script=None,
  antes=[("d","Hoje"),("p","Vou pensar e te falo","11:10"),("c","Tudo bem, fico no aguardo!","11:12"),("s","Nunca mais respondeu.")],
  depois=[("d","Hoje"),("p","Vou pensar e te falo","11:10"),("c","Claro, é uma decisão importante! O que ficou de dúvida: o valor, o tratamento ou você quer conversar com alguém antes?","11:12"),("p","Na verdade, é o valor","11:15")],
  passos=["Perguntar o que falta","Responder a dúvida","Combinar o retorno"]),
 dict(nome="Retorno", sinal="Orçamentos sem resposta, e ninguém sabe quantos.", ferr="Planilha de orçamentos parados",
  script="Oi, [nome]! Aqui é a [atendente], da [clínica]. Estou revendo seu plano de tratamento com o(a) Dr(a). [nome]. Ficou alguma dúvida sobre o que conversamos na avaliação?",
  antes=[("d","15 dias depois"),("c","Oi, e aí, decidiu?","09:30"),("s","Visualizado. Sem resposta.")],
  depois=[("d","2 dias depois"),("c","Oi, Ana! Aqui é a Júlia, da clínica. Estou revendo seu plano com a Dra. Paula. Ficou alguma dúvida sobre a avaliação?","09:30"),("p","Fiquei sim, sobre o tempo de tratamento","10:02")],
  passos=["Listar os orçamentos","Definir as datas","Motivo novo a cada mensagem"]),
]
e=html.escape
def msg(m):
    if m[0]=="d": return f'<div class="cd">{e(m[1])}</div>'
    if m[0]=="s": return f'<div class="cf">{e(m[1])}</div>'
    chk='<em>✓✓</em>' if m[0]=="c" else ''
    return f'<div class="m {m[0]}">{e(m[1])}<span>{m[2]}{chk}</span></div>'
def wa(titulo,classe,lista,status):
    return f'''<div class="col"><div class="rot {classe}">{titulo}</div><div class="wa"><div class="wt"><i>P</i><div><b>Paciente</b><small>{status}</small></div></div><div class="wb">{''.join(msg(m) for m in lista)}</div></div></div>'''
def topo(dir_txt, esq=None):
    return f'<div class="topo">{esq or ""}<span class="logo"><img src="logo.png" alt="RiseUp Odonto"></span></div>' if esq else f'<div class="topo"><span class="logo"><img src="logo.png" alt="RiseUp Odonto"></span><span>{dir_txt}</span></div>'
def rod(t,n): return f'<div class="rodape"><a href="{Q}">{t} →</a><span>{n}</span></div>'
pgs=[]
pgs.append(f'''<section class="pg capa">
<span class="circ" style="width:150mm;height:150mm;right:-55mm;top:-55mm"></span><span class="circ" style="width:120mm;height:120mm;left:-50mm;bottom:-60mm"></span>
<div class="rel"><img src="logo-branca.png" alt="RiseUp Odonto" style="height:12mm"></div>
<div class="rel" style="margin-top:58mm"><div class="sobre cc">Guia para donos de clínica</div><h1 style="font-size:54pt">Depois que o <span class="cc">lead chega</span></h1></div>
<p class="rel" style="font-size:16pt;color:#e3e9e9">6 etapas, 2 minutos de leitura.</p>
<div class="rel" style="margin-top:auto;display:flex;flex-direction:column;gap:4mm"><a class="btn" href="{Q}" style="align-self:flex-start;font-size:13pt">Calcular o vazamento da minha clínica</a><span style="font-size:10pt;color:#e3e9e9">8 perguntas, cerca de 2 minutos. O resultado aparece na hora.</span></div>
</section>''')
pgs.append(f'''<section class="pg escuro">
<div class="topo"><span class="logo"><img src="logo-branca.png" alt="RiseUp Odonto"></span><span>O problema</span></div>
<div class="grande"><b>8</b><span>de cada 100 contatos viram tratamento.</span></div>
<div class="barras">
<div class="l"><span>Contatos</span><div class="t"><i style="width:100%"></i></div><span>100</span></div>
<div class="l"><span>Agendam</span><div class="t"><i style="width:40%"></i></div><span>40</span></div>
<div class="l"><span>Comparecem</span><div class="t"><i style="width:28%"></i></div><span>28</span></div>
<div class="l"><span>Fecham</span><div class="t"><i style="width:8%;background:#fff"></i></div><span>8</span></div>
</div>
<p style="font-size:15pt;color:#e3e9e9;max-width:150mm">Em muitas clínicas, o problema não é a falta de contatos. É o que acontece depois.</p>
<p style="font-size:9pt;color:#7e8a8a">Números ilustrativos.</p>
<div class="rodape escuro-r"><a href="{Q}">Calcular o vazamento da minha clínica →</a><span>2</span></div>
</section>''')
mapa=''.join(f'<div><b>{k+1}</b><span class="t">{e(x["nome"])}</span><span class="d">{e(x["sinal"])}</span></div>' for k,x in enumerate(E))
pgs.append(f'''<section class="pg">{topo("As 6 etapas")}
<h2>As 6 etapas depois que o lead chega</h2>
<p class="muted">Vá direto à etapa que mais dói. Se ainda não sabe qual é, comece pela primeira.</p>
<div class="mapa">{mapa}</div>
{rod("Calcular o vazamento da minha clínica",3)}</section>''')
for k,x in enumerate(E):
    passos=''.join(f'<span><b>{j+1}</b>{e(p)}</span>' for j,p in enumerate(x["passos"]))
    ferr=(f'<div class="ferr"><h3>Script pronto · {e(x["ferr"]) if k!=5 else "Mensagem de retomada"}</h3><div class="s">{e(x["script"])}</div>'+('<p>Planilha de orçamentos parados: liberada no mini diagnóstico.</p>' if k==5 else '')+'</div>') if x["script"] else f'<div class="bloq"><div><h3>{e(x["ferr"])}</h3><p class="muted">Liberado no seu mini diagnóstico, se esta for a sua etapa mais fraca.</p></div><a class="btn out" href="{Q}">Fazer o diagnóstico</a></div>'
    pgs.append(f'''<section class="pg">
<div class="topo"><span class="sobre">Etapa {k+1} de 6</span><span class="logo"><img src="logo.png" alt="RiseUp Odonto"></span></div>
<h2>{e(x["nome"])}</h2>
<div class="sinal"><b>!</b>{e(x["sinal"])}</div>
<div class="duas">{wa("Como costuma ser","r-antes",x["antes"],"visto por último hoje")}{wa("Como fazer","r-depois",x["depois"],"online")}</div>
<div class="passos">{passos}</div>
{ferr}
{rod("Descubra se esta é a sua etapa mais fraca",k+4)}</section>''')
pgs.append(f'''<section class="pg">{topo("Caso real")}
<h2>De R$ 55 mil para R$ 115 mil por mês em 3 meses</h2>
<div class="nums"><div><small>Antes</small><b>R$ 55 mil</b><small>por mês, estagnada</small></div><div class="dk"><small>3 meses depois</small><b>R$ 115 mil</b><small>e uma cadeira a mais</small></div></div>
<div class="tags"><span>Corrigido: 1 · Primeira resposta</span><span>6 · Retorno</span></div>
<p class="muted" style="font-size:13pt">Clínica com 3 dentistas. O atendimento não dava conta e ninguém retomava os orçamentos.</p>
{rod("Calcular o vazamento da minha clínica",10)}</section>''')
pgs.append(f'''<section class="pg capa">
<span class="circ" style="width:140mm;height:140mm;left:-50mm;top:-50mm"></span><span class="circ" style="width:120mm;height:120mm;right:-45mm;bottom:-45mm"></span>
<div class="rel"><img src="logo-branca.png" alt="RiseUp Odonto" style="height:12mm"></div>
<h2 class="rel" style="margin-top:55mm;font-size:32pt">Qual etapa pesa mais na <span class="cc">sua clínica</span>?</h2>
<div class="rel fin"><div><b>1</b>A etapa mais fraca</div><div><b>2</b>Quanto ela custa por mês</div><div><b>3</b>A ferramenta para corrigir</div></div>
<a class="btn rel" style="align-self:flex-start;font-size:13pt" href="{Q}">Calcular o vazamento da minha clínica</a>
<p class="rel" style="margin-top:auto;font-size:10pt;color:#e3e9e9">RiseUp Odonto · sistema de captação, conversão e retenção</p>
</section>''')
css=open(sys.argv[1]).read()
open(sys.argv[2],'w').write(f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Depois que o lead chega · RiseUp Odonto</title><style>{css}</style></head><body>{"".join(pgs)}</body></html>')
