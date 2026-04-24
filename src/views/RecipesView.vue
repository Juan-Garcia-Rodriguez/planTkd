<template>
<div>
  <div class="rvh">
    <div class="rvi">
      <RouterLink to="/" class="back mono">← Accueil</RouterLink>
      <h1 class="d rvtitle">TOUTES LES RECETTES</h1>
      <p class="mono" style="font-size:12px;color:var(--gray);margin-bottom:18px;letter-spacing:1px">{{ Object.keys(recipes).length }} recettes · Batch cooking · Hypos à congeler</p>
      <div class="filters">
        <button class="fb" :class="{fba:f==='all'}" @click="f='all'">Toutes</button>
        <button class="fb" :class="{fba:f==='meal'}" @click="f='meal'">🍽️ Repas</button>
        <button class="fb" :class="{fba:f==='hypo'}" @click="f='hypo'">🥤 Hypos</button>
      </div>
    </div>
  </div>
  <div class="page-pad">
    <div class="rlist">
      <div class="rrow" v-for="r in filtered" :key="r.id" @click="sel=r">
        <span class="remoji">{{ r.emoji }}</span>
        <div class="rinfo">
          <div class="d rname">{{ r.name }}</div>
          <div class="mono rtag" :class="r.isHypo?'c-blue':'c-accent'">{{ r.tag }}</div>
          <div class="rmacs">
            <span class="mono">{{ r.kcal }} kcal</span>
            <span class="mono rdot">P:{{r.macros.p}}g</span>
            <span class="mono rdot">G:{{r.macros.g}}g</span>
            <span class="mono rdot">L:{{r.macros.l}}g</span>
          </div>
          <div class="rdesc">{{ r.description }}</div>
        </div>
        <span class="rarr">→</span>
      </div>
    </div>
  </div>
  <RecipeModal :show="!!sel" :recipe="sel" :color="sel?.isHypo?'blue':'red'" @close="sel=null"/>
</div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { recipes } from '../data/plan.js'
import RecipeModal from '../components/RecipeModal.vue'
const f = ref('all')
const sel = ref(null)
const all = Object.values(recipes)
const filtered = computed(()=>{
  if(f.value==='hypo')return all.filter(r=>r.isHypo)
  if(f.value==='meal')return all.filter(r=>!r.isHypo)
  return all
})
</script>
<style scoped>
.rvh{background:linear-gradient(160deg,#0a0808,#0d0d0d 80%);border-bottom:1px solid rgba(255,255,255,.05);padding:28px 16px}
.rvi{max-width:800px;margin:0 auto}
.back{font-family:var(--font-m);font-size:11px;color:var(--gray);letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:12px;transition:color .15s}
.back:hover{color:var(--light)}
.rvtitle{font-family:var(--font-d);font-size:clamp(26px,7vw,48px);letter-spacing:2px;margin-bottom:6px}
.filters{display:flex;gap:7px;flex-wrap:wrap}
.fb{font-family:var(--font-m);font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:5px 13px;border:1px solid rgba(255,255,255,.1);background:transparent;color:var(--gray);cursor:pointer;border-radius:2px;transition:all .15s}
.fb:hover{color:var(--light);border-color:rgba(255,255,255,.2)}
.fba{background:var(--red-bg);border-color:var(--red-border);color:var(--red)}
.rlist{display:flex;flex-direction:column;gap:7px}
.rrow{display:flex;align-items:center;gap:14px;background:var(--dark3);border:1px solid rgba(255,255,255,.04);padding:14px 16px;cursor:pointer;transition:all .15s;color:inherit}
.rrow:hover{background:var(--dark4);transform:translateX(3px)}
.remoji{font-size:30px;flex-shrink:0}
.rinfo{flex:1;min-width:0}
.rname{font-size:17px;letter-spacing:1px;margin-bottom:2px}
.rtag{font-size:10px;letter-spacing:.5px;margin-bottom:5px}
.rmacs{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:3px}
.mono{font-family:var(--font-m)}
.rmacs .mono{font-size:11px;color:var(--gray2)}
.rdesc{font-size:12px;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rarr{font-size:17px;color:var(--gray);flex-shrink:0;transition:transform .15s}
.rrow:hover .rarr{transform:translateX(3px);color:var(--light)}
</style>
