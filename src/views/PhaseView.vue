<template>
<div v-if="phase">
  <div class="ph" :class="`ph-${phase.color}`">
    <div class="phi">
      <RouterLink to="/" class="back mono">← Accueil</RouterLink>
      <div class="mono phlbl">Phase {{ phase.id }}</div>
      <h1 class="d phtitle">{{ phase.name }}</h1>
      <div class="mono phdates">{{ phase.dates }}</div>
      <div class="mcs">
        <div class="mc" v-for="m in mcs" :key="m.l">
          <span class="d mcv" :class="`c-${m.c}`">{{ m.v }}</span>
          <span class="mono mcl">{{ m.l }}</span>
        </div>
      </div>
      <div class="mono" style="font-size:11px;color:var(--gray)">TDEE estimé : {{phase.tdee}} kcal · Déficit : {{phase.deficit}}</div>
    </div>
  </div>

  <div class="page-pad">
    <div v-if="phase.id===1" class="alert alert-red" style="margin-bottom:18px">
      <strong>📌 Phase 1</strong> — Semaine de travail, entraînements en soirée uniquement. Batch cooking le dimanche.
    </div>
    <div v-if="phase.id===2" class="alert alert-green" style="margin-bottom:18px">
      <strong>💪 Phase 2</strong> — Journées 100% libres. Double séances la plupart des jours. Tu manges plus (2200 kcal) car tu dépenses ~3300 kcal. Cheatmeal le 10 mai.
    </div>
    <div v-if="phase.id===3" class="alert alert-blue" style="margin-bottom:18px">
      <strong>🥋 Phase 3</strong> — Retour TKD Club (lun, mer, jeu). À partir du 13 mai : réduction sel pour libérer l'eau naturellement. Repos total le 15 mai.
    </div>

    <div class="section-title d">Jours — Phase {{ phase.id }}</div>
    <div class="section-desc">// Cliquer sur un jour pour voir le détail complet</div>

    <div class="dlist">
      <RouterLink :to="`/day/${d.id}`" class="drow" :class="dclass(d)" v-for="d in pdays" :key="d.id">
        <div class="dleft">
          <div class="d dnum" :class="`c-${phase.color}`">{{ d.id }}</div>
          <div>
            <div class="mono" style="font-size:10px;color:var(--gray);text-transform:uppercase;letter-spacing:1px">{{ d.day }}</div>
            <div style="font-size:13px;font-weight:600">{{ d.date }}</div>
          </div>
        </div>
        <div class="dcenter">
          <div class="dnote">{{ d.note }}</div>
          <div class="dtags">
            <span class="dtag mono" v-for="m in d.meals.slice(0,3)" :key="m.label">{{m.time}} {{m.label}}</span>
          </div>
        </div>
        <div class="dright">
          <div><span class="d" :class="wcolor(d.w)" style="font-size:22px">{{d.w}}</span><span class="mono" style="font-size:10px;color:var(--gray)"> kg</span></div>
          <div class="tbadge mono" :class="`tb-${phase.color}`" v-if="d.training && trainings[d.training]">{{ trainings[d.training].emoji }} {{ trainings[d.training].name }}</div>
          <span class="arr">→</span>
        </div>
      </RouterLink>
    </div>
  </div>
</div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { days, phases, trainings } from '../data/plan.js'
const route = useRoute()
const pid = computed(()=>parseInt(route.params.id))
const phase = computed(()=>phases.find(p=>p.id===pid.value))
const pdays = computed(()=>days.filter(d=>d.phase===pid.value))
const mcs = computed(()=>[
  {v:phase.value?.kcal,l:'kcal/j',c:phase.value?.color},
  {v:`${phase.value?.macros.p}g`,l:'protéines',c:'accent'},
  {v:`${phase.value?.macros.g}g`,l:'glucides',c:'green'},
  {v:`${phase.value?.macros.l}g`,l:'lipides',c:'blue'},
])
function dclass(d){ const c=[];if(d.batch)c.push('batch');if(d.cheatmeal)c.push('cheat');if(d.rest)c.push('rest');if(d.salt)c.push('salt');return c.join(' ') }
function wcolor(w){ if(w<74)return'c-green';if(w<75.5)return'c-accent';return'c-red' }
</script>
<style scoped>
.ph{padding:32px 16px;border-bottom:1px solid rgba(255,255,255,.05)}
.ph-red{background:linear-gradient(160deg,#110606 0%,#0d0d0d 80%)}
.ph-green{background:linear-gradient(160deg,#060f0e 0%,#0d0d0d 80%)}
.ph-blue{background:linear-gradient(160deg,#060910 0%,#0d0d0d 80%)}
.phi{max-width:800px;margin:0 auto}
.back{font-size:11px;color:var(--gray);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:14px;transition:color .15s}
.back:hover{color:var(--light)}
.phlbl{font-size:11px;color:var(--gray);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.phtitle{font-family:var(--font-d);font-size:clamp(28px,7vw,52px);line-height:.95;letter-spacing:2px;margin-bottom:7px}
.phdates{font-size:12px;color:var(--gray);letter-spacing:1px;margin-bottom:20px}
.mcs{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:12px}
.mc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);padding:10px 12px;display:flex;flex-direction:column;gap:3px}
.mcv{font-size:26px;line-height:1}
.mcl{font-size:9px;color:var(--gray);text-transform:uppercase;letter-spacing:1px}
.dlist{display:flex;flex-direction:column;gap:5px}
.drow{display:flex;align-items:center;gap:14px;background:var(--dark3);border:1px solid rgba(255,255,255,.04);padding:12px 16px;cursor:pointer;transition:all .15s;color:inherit}
.drow:hover{background:var(--dark4);transform:translateX(3px)}
.batch{border-left:3px solid var(--accent)}.cheat{border-left:3px solid var(--gold);background:rgba(233,196,106,.03)}.rest{border-left:3px solid var(--blue)}.salt{border-left:3px solid var(--green)}
.dleft{display:flex;align-items:center;gap:10px;min-width:88px}
.dnum{font-size:28px;line-height:1;min-width:32px}
.dcenter{flex:1;min-width:0}
.dnote{font-size:13px;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dtags{display:flex;flex-wrap:wrap;gap:3px}
.dtag{font-size:9px;padding:2px 5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);color:var(--gray);white-space:nowrap}
.dright{display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:110px}
.tbadge{font-size:9px;padding:2px 7px;letter-spacing:.4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}
.tb-red{background:var(--red-bg);color:var(--red);border:1px solid var(--red-border)}
.tb-green{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)}
.tb-blue{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.arr{font-size:15px;color:var(--gray);transition:transform .15s}
.drow:hover .arr{transform:translateX(3px);color:var(--light)}
@media(max-width:600px){.mcs{grid-template-columns:repeat(2,1fr)}.tbadge,.dtags{display:none}.dright{min-width:70px}}
</style>
