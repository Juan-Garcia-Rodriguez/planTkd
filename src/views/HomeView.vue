<template>
<div>
  <div class="hero">
    <div class="hi">
      <div class="mono hlbl">Plan de préparation · Compétition Taekwondo</div>
      <h1 class="d htitle">OBJECTIF <span class="c-red">&lt;74 KG</span></h1>
      <p class="mono hsub">25 avril → 16 mai 2026 · Sans water cut · 3 phases · 21 jours</p>
      <div class="stats">
        <div class="sbox" v-for="s in stats" :key="s.l">
          <div class="d sval" :class="`c-${s.c}`">{{ s.v }}</div>
          <div class="mono slbl">{{ s.l }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-pad">
    <div class="alert alert-accent" style="margin-bottom:10px">
      <strong>⚙️ Stratégie</strong> — Les 3,4 kg = ~1,1 kg graisse pure + ~1,2 kg glycogène+eau + ~0,8-1 kg rétention eau réduite naturellement. Objectif atteignable proprement sans water cut.
    </div>
    <div class="alert alert-green" style="margin-bottom:28px">
      <strong>✅ Pas de water cut</strong> — Pesée = jour de compétition. On arrive hydraté et énergisé pour performer sur le tatami.
    </div>

    <div class="section-title d">Courbe de poids estimée</div>
    <div class="section-desc">// Estimation théorique · Fluctuations normales de ±0,5 kg selon hydratation</div>

    <div class="chart-card">
      <div class="chart-hdr">
        <span class="d" style="font-size:15px;letter-spacing:1px">ÉVOLUTION DU POIDS</span>
        <span class="tag tag-gray mono">77,4 kg → &lt;74 kg</span>
      </div>
      <div class="chart-wrap">
        <svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" class="svg">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#E63946" stop-opacity=".4"/>
              <stop offset="100%" stop-color="#E63946" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#E63946"/>
              <stop offset="45%" stop-color="#2a9d8f"/>
              <stop offset="100%" stop-color="#e9c46a"/>
            </linearGradient>
          </defs>
          <line v-for="y in ygrid" :key="y.v" :x1="OX" :y1="y.y" :x2="OX+CW" :y2="y.y" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
          <text v-for="y in ygrid" :key="'t'+y.v" :x="OX-6" :y="y.y+4" fill="#555" font-size="11" text-anchor="end" font-family="JetBrains Mono,monospace">{{y.v}}</text>
          <line :x1="OX" :y1="ty" :x2="OX+CW" :y2="ty" stroke="rgba(230,57,70,.35)" stroke-width="1" stroke-dasharray="5,4"/>
          <text :x="OX+CW+6" :y="ty+4" fill="#E63946" font-size="10" font-family="JetBrains Mono,monospace">74</text>
          <rect :x="OX" y="10" :width="pw1" height="200" fill="rgba(230,57,70,.04)"/>
          <rect :x="OX+pw1" y="10" :width="pw2" height="200" fill="rgba(42,157,143,.04)"/>
          <rect :x="OX+pw1+pw2" y="10" :width="pw3" height="200" fill="rgba(69,123,157,.04)"/>
          <text :x="OX+pw1/2" y="26" fill="rgba(230,57,70,.5)" font-size="10" text-anchor="middle" font-family="JetBrains Mono,monospace">PHASE 1</text>
          <text :x="OX+pw1+pw2/2" y="26" fill="rgba(42,157,143,.5)" font-size="10" text-anchor="middle" font-family="JetBrains Mono,monospace">PHASE 2</text>
          <text :x="OX+pw1+pw2+pw3/2" y="26" fill="rgba(69,123,157,.5)" font-size="10" text-anchor="middle" font-family="JetBrains Mono,monospace">PHASE 3</text>
          <path :d="area" fill="url(#lg)" opacity=".35"/>
          <path :d="line" fill="none" stroke="url(#lg2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle v-for="(p,i) in pts" :key="i" :cx="p.x" :cy="p.y" r="2.5" :fill="pColor(p.ph)" opacity=".7"/>
          <circle :cx="pts[pts.length-1].x" :cy="pts[pts.length-1].y" r="6" fill="var(--gold)" stroke="var(--dark)" stroke-width="2"/>
        </svg>
      </div>
    </div>

    <div class="section-title d" style="margin-top:32px">Les 3 phases</div>
    <div class="section-desc">// Cliquer pour voir le détail jour par jour</div>

    <div class="phases">
      <RouterLink :to="`/phase/${p.id}`" class="pcard" :class="`pc-${p.color}`" v-for="p in phases" :key="p.id">
        <div class="d pnum" :class="`c-${p.color}`">{{ p.id }}</div>
        <div class="pinfo">
          <div class="d pname">{{ p.name }}</div>
          <div class="mono pdates">{{ p.dates }}</div>
          <div class="pkcal"><span class="d" style="font-size:26px">{{ p.kcal }}</span><span class="mono" style="font-size:10px;color:var(--gray)"> kcal/j</span></div>
          <div class="pmacros">
            <span class="mtag mono">P: {{p.macros.p}}g</span>
            <span class="mtag mono">G: {{p.macros.g}}g</span>
            <span class="mtag mono">L: {{p.macros.l}}g</span>
          </div>
          <div class="mono" style="font-size:11px;color:var(--gray);margin-top:6px">Déficit : {{p.deficit}}</div>
        </div>
        <span class="parr">→</span>
      </RouterLink>
    </div>

    <RouterLink to="/day/22" class="compbanner">
      <div>
        <div class="mono" style="font-size:11px;color:var(--gold);letter-spacing:2px;margin-bottom:4px">16 MAI 2026</div>
        <div class="d" style="font-size:26px;letter-spacing:2px;color:var(--gold)">JOUR DE COMPÉTITION 🏆</div>
        <div class="mono" style="font-size:11px;color:var(--gray);margin-top:4px;letter-spacing:1px">Voir le protocole complet</div>
      </div>
      <div class="d" style="font-size:30px;color:var(--gold)">→</div>
    </RouterLink>
  </div>
</div>
</template>
<script setup>
import { computed } from 'vue'
import { days, phases } from '../data/plan.js'
const stats = [
  {v:'77,4',l:'Poids départ (kg)',c:'gray2'},
  {v:'<74',l:'Objectif pesée (kg)',c:'red'},
  {v:'-3,4',l:'À perdre (kg)',c:'accent'},
  {v:'21',l:'Jours de prépa',c:'green'},
]
const OX=60, OY=30, CW=600, CH=180, minW=73.2, maxW=78.0
function tx(i){ return OX+(i/(days.length-1))*CW }
function ty2(w){ return OY+10+((maxW-w)/(maxW-minW))*(CH-20) }
const pts = computed(()=>days.map((d,i)=>({x:tx(i),y:ty2(d.w),ph:d.phase})))
const ty = computed(()=>ty2(74))
const line = computed(()=>pts.value.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' '))
const area = computed(()=>{
  const ps=pts.value, bot=ty2(minW-.2)
  return ps.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ')+` L${ps[ps.length-1].x},${bot} L${ps[0].x},${bot} Z`
})
const ygrid = [78,77,76,75,74,73].map(v=>({v,y:ty2(v)}))
const p1n=days.filter(d=>d.phase===1).length, p2n=days.filter(d=>d.phase===2).length, p3n=days.length-p1n-p2n
const pw1=p1n/days.length*CW, pw2=p2n/days.length*CW, pw3=p3n/days.length*CW
function pColor(ph){ if(ph===1)return'var(--red)';if(ph===2)return'var(--green)';if(ph===3)return'var(--blue)';return'var(--gold)' }
</script>
<style scoped>
.hero{background:linear-gradient(160deg,#100505 0%,#0d0d0d 80%);border-bottom:1px solid rgba(230,57,70,.18);padding:44px 16px 36px;position:relative;overflow:hidden}
.hero::before{content:"TKD";position:absolute;right:-10px;top:-10px;font-family:var(--font-d);font-size:160px;color:rgba(230,57,70,.04);pointer-events:none;letter-spacing:-6px}
.hi{max-width:800px;margin:0 auto}
.hlbl{font-size:11px;color:var(--red);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.htitle{font-family:var(--font-d);font-size:clamp(40px,10vw,76px);line-height:.95;letter-spacing:2px;margin-bottom:12px}
.hsub{font-size:13px;color:var(--gray);margin-bottom:28px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.sbox{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);border-left:3px solid rgba(230,57,70,.35);padding:12px 14px}
.sval{font-size:28px;line-height:1}
.slbl{font-size:9px;color:var(--gray);text-transform:uppercase;letter-spacing:1px;margin-top:3px}
.chart-card{background:var(--dark3);border:1px solid rgba(255,255,255,.05);margin-bottom:12px}
.chart-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--dark4);border-bottom:1px solid rgba(255,255,255,.05)}
.chart-wrap{padding:8px 4px;overflow-x:auto}
.svg{width:100%;min-width:380px}
.phases{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.pcard{display:flex;align-items:center;gap:18px;background:var(--dark3);border:1px solid rgba(255,255,255,.04);border-left:4px solid;padding:18px 20px;transition:all .15s;color:inherit}
.pcard:hover{background:var(--dark4);transform:translateX(3px)}
.pc-red{border-left-color:var(--red)}.pc-green{border-left-color:var(--green)}.pc-blue{border-left-color:var(--blue)}
.pnum{font-size:50px;line-height:1;min-width:44px}
.pinfo{flex:1}
.pname{font-size:19px;letter-spacing:1px;margin-bottom:2px}
.pdates{font-size:11px;color:var(--gray);letter-spacing:1px;margin-bottom:6px}
.pmacros{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}
.mtag{font-size:10px;padding:2px 7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:var(--gray2)}
.parr{font-size:20px;color:var(--gray);transition:transform .15s}
.pcard:hover .parr{transform:translateX(4px);color:var(--light)}
.compbanner{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(233,196,106,.1),rgba(233,196,106,.04));border:2px solid rgba(233,196,106,.28);padding:22px 26px;transition:all .15s;color:inherit}
.compbanner:hover{background:linear-gradient(135deg,rgba(233,196,106,.15),rgba(233,196,106,.07))}
@media(max-width:600px){.stats{grid-template-columns:repeat(2,1fr)}}
</style>
