<template>
<div v-if="day">
  <div class="dh" :class="`dh-${pc}`">
    <div class="dhi">
      <div class="dnav">
        <RouterLink :to="prev?`/day/${prev.id}`:'/'" class="nb mono" :class="{dis:!prev}">← Préc</RouterLink>
        <RouterLink :to="back" class="nb nc mono">{{ phLabel }}</RouterLink>
        <RouterLink :to="next?`/day/${next.id}`:'/'" class="nb mono" :class="{dis:!next}">Suiv →</RouterLink>
      </div>
      <div class="dname-row">
        <span class="d dday" :class="`c-${pc}`">{{ day.day }}</span>
        <span class="d ddate">{{ day.date }}</span>
      </div>
      <div class="dnote">{{ day.note }}</div>
      <div v-if="day.batch" class="dalt da-accent">📦 <strong>Batch cooking</strong> — Cuisiner pour plusieurs jours, préparer les hypos à congeler</div>
      <div v-if="day.cheatmeal" class="dalt da-gold">🍕 <strong>Cheatmeal mérité !</strong> — Évite l'alcool et l'excès de sel</div>
      <div v-if="day.salt" class="dalt da-blue">🧂 <strong>Réduction sel</strong> — Évite sauces industrielles et charcuterie</div>
      <div v-if="day.rest" class="dalt da-blue">😴 <strong>Repos total</strong> — Stretching uniquement. Prépare ton sac de compét.</div>
      <div v-if="day.compDay" class="dalt da-gold">🏆 <strong>JOUR DE COMPÉTITION</strong> — Tu as tout préparé. Fais confiance à ton travail !</div>
      <div class="dstats">
        <div class="dstat">
          <span class="d dsv" :class="wc(day.w)">{{ day.w }}</span>
          <span class="mono dsl">kg estimé</span>
        </div>
        <div class="dstat" v-if="day.kcal">
          <span class="d dsv c-accent">{{ day.kcal }}</span>
          <span class="mono dsl">kcal prévues</span>
        </div>
        <div class="dstat" v-if="tr">
          <span class="d dsv" style="font-size:13px;padding-top:7px">{{ tr.emoji }} {{ tr.intensity }}</span>
          <span class="mono dsl">intensité</span>
        </div>
      </div>
      <div v-if="day.tips" class="dtips mono">💡 {{ day.tips }}</div>
    </div>
  </div>

  <div class="tabs">
    <button class="tab" :class="{act:tab==='meals'}" @click="tab='meals'">🍽️ <span>Repas</span></button>
    <button class="tab" :class="{act:tab==='training'}" @click="tab='training'">🏋️ <span>Entraînement</span></button>
    <button class="tab" :class="{act:tab==='stretch'}" @click="tab='stretch'">🧘 <span>Stretching</span></button>
  </div>

  <div class="page-pad">
    <Transition name="fade" mode="out-in">

      <!-- MEALS -->
      <div v-if="tab==='meals'" key="meals">
        <div class="mcbar" v-if="phData && !day.compDay">
          <div class="mb kcal"><span class="d mbv">{{ phData.kcal }}</span><span class="mono mbl">kcal cible</span></div>
          <div class="mb prot"><span class="d mbv">{{ phData.macros.p }}g</span><span class="mono mbl">protéines</span></div>
          <div class="mb gluc"><span class="d mbv">{{ phData.macros.g }}g</span><span class="mono mbl">glucides</span></div>
          <div class="mb lip"><span class="d mbv">{{ phData.macros.l }}g</span><span class="mono mbl">lipides</span></div>
        </div>
        <div class="mlist">
          <div class="mcard" v-for="m in day.meals" :key="m.label">
            <div class="mtop">
              <span class="mono mtime">{{ m.time }}</span>
              <span class="mlabel">{{ m.label }}</span>
              <span class="mono mkcal" v-if="m.kcal&&!m.cheatNote&&!m.specialNote">{{ m.kcal }} kcal</span>
            </div>
            <div v-if="m.cheatNote" class="cheat-block">
              <div class="d" style="font-size:26px;color:var(--gold)">🍕 CHEATMEAL</div>
              <p class="mono" style="font-size:12px;color:var(--gray2);margin-top:8px">{{ m.cheatNote }}</p>
            </div>
            <div v-else-if="m.specialNote" class="special-block mono">{{ m.specialNote }}</div>
            <div v-else-if="m.rid && recipes[m.rid]" class="recipe-row" @click="open(m.rid)">
              <div class="rp">
                <span class="remoji">{{ recipes[m.rid].emoji }}</span>
                <div>
                  <div class="rname">{{ recipes[m.rid].name }}</div>
                  <div class="mono rmacros">P:{{recipes[m.rid].macros.p}}g · G:{{recipes[m.rid].macros.g}}g · L:{{recipes[m.rid].macros.l}}g</div>
                </div>
              </div>
              <div class="mono ropn">Voir →</div>
            </div>
          </div>
        </div>
        <div class="alert alert-blue" style="margin-top:14px;font-size:13px">
          💧 <strong>Hydratation :</strong> {{ day.phase===2?'2,5L minimum — tu transpires beaucoup avec les doubles séances.':'2L minimum dans la journée.' }}
        </div>
      </div>

      <!-- TRAINING -->
      <div v-else-if="tab==='training'" key="training">
        <div v-if="tr">
          <div class="trhdr">
            <div class="d trname">{{ tr.emoji }} {{ tr.name }}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
              <span class="tag" :class="`tag-${tr.color||'red'}`">{{ tr.dur }}</span>
              <span class="tag" :class="itag(tr.intensity)">{{ tr.intensity }}</span>
            </div>
          </div>
          <div class="tblocks">
            <div class="tblock" v-for="(b,i) in tr.blocks" :key="i">
              <div class="d tbn" :class="`c-${tr.color||'red'}`">{{ i+1 }}</div>
              <div class="tbc">
                <div class="mono tbt">{{ b.time }}</div>
                <div class="d tbti">{{ b.title }}</div>
                <div class="tbdesc">{{ b.desc }}</div>
              </div>
            </div>
          </div>
          <div v-if="tr.id==='hiit_corde'||tr.name?.includes('HIIT')" class="hiit-table">
            <div class="mono" style="font-size:10px;color:var(--gray);letter-spacing:2px;text-transform:uppercase;margin:20px 0 10px">Tableau des 12 rounds</div>
            <div class="hrow" v-for="r in hiitRounds" :key="r.r" :class="{peak:r.peak}">
              <span class="mono" style="font-size:11px;color:var(--gray);min-width:86px">{{ r.r }}</span>
              <span style="font-size:13px;flex:1">{{ r.desc }}</span>
              <span class="mono" style="font-size:11px;color:var(--gray2)">{{ r.rec }}</span>
            </div>
          </div>
        </div>
        <div v-else class="rest-blk">
          <div style="font-size:44px;margin-bottom:10px">😴</div>
          <div class="d" style="font-size:22px;letter-spacing:2px;margin-bottom:8px">REPOS</div>
          <p class="mono" style="color:var(--gray);font-size:13px">Pas de sport. Stretching léger uniquement. Récupération active.</p>
        </div>
      </div>

      <!-- STRETCHING -->
      <div v-else-if="tab==='stretch'" key="stretch">
        <div class="slbl mono">Stretching Dynamique · Matin · 15 min</div>
        <div class="slist">
          <div class="si" v-for="e in stretchD" :key="e.name">
            <span>{{ e.name }}</span><span class="mono" style="color:var(--accent);font-size:11px">{{ e.detail }}</span>
          </div>
        </div>
        <div class="slbl mono" style="margin-top:20px">Stretching Statique · Soir · 20 min</div>
        <div class="slist">
          <div class="si" v-for="e in stretchS" :key="e.name">
            <span>{{ e.name }}</span><span class="mono" style="color:var(--blue);font-size:11px">{{ e.detail }}</span>
          </div>
        </div>
        <div class="alert alert-accent" style="margin-top:16px;font-size:13px">
          🥋 <strong>Crucial en TKD :</strong> la souplesse des hanches est directement liée à la hauteur et la vitesse de tes coups de pied. Ne saute jamais cette session.
        </div>
      </div>

    </Transition>
  </div>

  <RecipeModal :show="!!sel" :recipe="sel" :color="pc" @close="sel=null"/>
</div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { days, phases, trainings, recipes, stretchDynamic, stretchStatic } from '../data/plan.js'
import RecipeModal from '../components/RecipeModal.vue'
const route = useRoute()
const id = computed(()=>parseInt(route.params.id))
const day = computed(()=>days.find(d=>d.id===id.value))
const prev = computed(()=>days.find(d=>d.id===id.value-1))
const next = computed(()=>days.find(d=>d.id===id.value+1))
const back = computed(()=>{ const p=day.value?.phase; return p&&p>0?`/phase/${p}`:'/' })
const phData = computed(()=>phases.find(p=>p.id===day.value?.phase))
const tr = computed(()=>day.value?.training?trainings[day.value.training]:null)
const pc = computed(()=>{
  if(!day.value?.phase||day.value.phase===0)return'gold'
  return phData.value?.color||'red'
})
const phLabel = computed(()=>{
  if(day.value?.compDay)return'🏆 JOUR J'
  if(day.value?.phase===1)return'Phase 1'
  if(day.value?.phase===2)return'Phase 2'
  if(day.value?.phase===3)return'Phase 3'
  return'Accueil'
})
const tab = ref('meals')
const sel = ref(null)
function open(rid){ sel.value=recipes[rid]||null }
function wc(w){ if(w<74)return'c-green';if(w<75.5)return'c-accent';return'c-red' }
function itag(i){ if(i==='Très élevée')return'tag-red';if(i==='Élevée')return'tag-accent';if(i==='Modérée')return'tag-green';return'tag-gray' }
const hiitRounds = [
  {r:'Rounds 1–3',desc:'Corde rythme modéré — chauffe progressivement',rec:'30s marche',peak:false},
  {r:'Rounds 4–8',desc:'Corde max + croisés, alternance pieds',rec:'30s shadow boxing',peak:true},
  {r:'Rounds 9–10',desc:'Sprints corde — pic d\'intensité maximum',rec:'30s respiration',peak:true},
  {r:'Rounds 11–12',desc:'Rythme décroissant — retour au calme',rec:'30s étirements',peak:false},
]
const stretchD = stretchDynamic
const stretchS = stretchStatic
</script>
<style scoped>
.dh{padding:22px 16px;border-bottom:1px solid rgba(255,255,255,.05)}
.dh-red{background:linear-gradient(160deg,#110606,#0d0d0d 80%)}
.dh-green{background:linear-gradient(160deg,#060f0e,#0d0d0d 80%)}
.dh-blue{background:linear-gradient(160deg,#060910,#0d0d0d 80%)}
.dh-gold{background:linear-gradient(160deg,#100d04,#0d0d0d 80%)}
.dhi{max-width:800px;margin:0 auto}
.dnav{display:flex;align-items:center;gap:6px;margin-bottom:18px}
.nb{font-family:var(--font-m);font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:6px 10px;color:var(--gray);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:2px;transition:all .15s}
.nb:hover{color:var(--light);background:rgba(255,255,255,.05)}
.nb.dis{opacity:.3;pointer-events:none}
.nc{flex:1;text-align:center}
.dname-row{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.dday{font-size:40px;line-height:1}
.ddate{font-size:32px;line-height:1;color:var(--gray2)}
.dnote{font-size:13px;color:var(--gray2);margin-bottom:10px}
.dalt{padding:9px 13px;font-size:13px;border-radius:2px;margin-bottom:8px;border-left:3px solid}
.da-accent{background:var(--accent-bg);border-color:var(--accent);color:#e8c8a8}
.da-gold{background:var(--gold-bg);border-color:var(--gold);color:var(--gold)}
.da-blue{background:var(--blue-bg);border-color:var(--blue);color:#b8d4e0}
.dstats{display:flex;gap:18px;flex-wrap:wrap;margin:14px 0 10px}
.dstat{display:flex;flex-direction:column;gap:2px}
.dsv{font-size:32px;line-height:1}
.dsl{font-size:9px;color:var(--gray);text-transform:uppercase;letter-spacing:1px}
.dtips{font-size:12px;color:var(--gray2);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.04);padding:9px 13px;line-height:1.6}
.tabs{display:flex;border-bottom:1px solid rgba(255,255,255,.06);background:var(--dark2);position:sticky;top:54px;z-index:10}
.tab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:11px 8px;font-family:var(--font-m);font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:var(--gray);background:none;border:none;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s}
.tab:hover{color:var(--light)}
.tab.act{color:var(--light);border-bottom-color:var(--red)}
.mcbar{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px}
.mb{background:var(--dark3);border:1px solid rgba(255,255,255,.05);padding:10px 10px;text-align:center}
.mbv{font-size:22px;line-height:1;display:block}
.mbl{font-size:9px;color:var(--gray);text-transform:uppercase;letter-spacing:1px;display:block;margin-top:2px}
.mb.kcal .mbv{color:var(--red)}.mb.prot .mbv{color:var(--accent)}.mb.gluc .mbv{color:var(--green)}.mb.lip .mbv{color:var(--blue)}
.mlist{display:flex;flex-direction:column;gap:9px}
.mcard{background:var(--dark3);border:1px solid rgba(255,255,255,.04);border-radius:2px;overflow:hidden}
.mtop{display:flex;align-items:center;gap:9px;padding:9px 14px;background:var(--dark4);border-bottom:1px solid rgba(255,255,255,.04)}
.mtime{font-size:10px;padding:2px 7px;background:rgba(255,255,255,.04);color:var(--red);letter-spacing:1px}
.mlabel{font-size:13px;font-weight:600;flex:1}
.mkcal{font-size:11px;color:var(--accent)}
.cheat-block{padding:18px;text-align:center;background:var(--gold-bg)}
.special-block{padding:13px 14px;font-size:12px;color:var(--gray2);letter-spacing:.3px}
.recipe-row{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;cursor:pointer;transition:background .15s}
.recipe-row:hover{background:var(--dark4)}
.rp{display:flex;align-items:center;gap:11px}
.remoji{font-size:26px}
.rname{font-size:14px;font-weight:600;margin-bottom:3px}
.rmacros{font-size:10px;color:var(--gray)}
.ropn{font-size:11px;color:var(--red);padding:5px 10px;border:1px solid var(--red-border);background:var(--red-bg);flex-shrink:0}
.trhdr{margin-bottom:18px}
.trname{font-size:22px;letter-spacing:1px}
.tblocks{display:flex;flex-direction:column;gap:9px}
.tblock{display:flex;gap:14px;background:var(--dark3);border:1px solid rgba(255,255,255,.04);padding:14px}
.tbn{font-size:32px;line-height:1;min-width:30px}
.tbc{flex:1}
.tbt{font-size:10px;color:var(--gray);letter-spacing:1px;margin-bottom:3px}
.tbti{font-size:15px;letter-spacing:1px;margin-bottom:5px}
.tbdesc{font-size:13px;color:var(--gray2);line-height:1.6}
.hrow{display:flex;align-items:center;gap:12px;padding:8px 11px;background:var(--dark3);border:1px solid rgba(255,255,255,.04);margin-bottom:4px}
.hrow.peak{background:rgba(230,57,70,.05);border-color:var(--red-border)}
.rest-blk{text-align:center;padding:44px 20px;background:var(--dark3);border:1px solid rgba(255,255,255,.04)}
.slbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--gray);margin-bottom:9px}
.slist{display:flex;flex-direction:column;gap:3px}
.si{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:var(--dark3);border:1px solid rgba(255,255,255,.04);font-size:13px}
@media(max-width:500px){.mcbar{grid-template-columns:repeat(2,1fr)}.dday{font-size:28px}.ddate{font-size:22px}.tab span{display:none}}
</style>
