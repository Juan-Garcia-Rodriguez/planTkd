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
        <button class="fb" :class="{fba:f==='phases'}" @click="f='phases'">📅 Par phase</button>
      </div>
    </div>
  </div>

  <div class="page-pad">
    <!-- Vue liste normale -->
    <div v-if="f !== 'phases'" class="rlist">
      <div class="rrow" v-for="r in filtered" :key="r.id" @click="open(r, 1)">
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

    <!-- Vue par batch cooking -->
    <div v-else>
      <div v-for="(batch, i) in batchRecipes" :key="batch.label" class="ph-block">
        <div class="ph-header ph-red" @click="batchOpen[i] = !batchOpen[i]">
          <div>
            <div class="d ph-title">🛒 {{ batch.label }}</div>
            <div class="mono ph-dates">{{ batch.dates }}</div>
          </div>
          <div class="ph-right">
            <span class="mono ph-meta">{{ batch.items.length }} recettes · {{ batch.totalUses }} repas</span>
            <span class="chevron" :class="{ rotated: !batchOpen[i] }">▼</span>
          </div>
        </div>
        <div v-show="batchOpen[i]">
        <div class="ph-note mono">Quantités adaptées pour tout cuisiner en une fois (× nombre d'utilisations sur la période)</div>
        <div class="rlist">
          <div class="rrow" v-for="item in batch.items" :key="item.recipe.id" :class="{ cooked: isCookedR(i, item.recipe.id) }" @click="open(item.recipe, item.count)">
            <span class="cb-r" @click.stop="toggleR(i, item.recipe.id)">{{ isCookedR(i, item.recipe.id) ? '☑' : '☐' }}</span>
            <span class="remoji">{{ item.recipe.emoji }}</span>
            <div class="rinfo">
              <div class="d rname">{{ item.recipe.name }}</div>
              <div class="rmacs">
                <span class="mono">{{ item.recipe.kcal * item.count }} kcal</span>
                <span class="mono rdot">P:{{item.recipe.macros.p * item.count}}g</span>
                <span class="mono rdot">G:{{item.recipe.macros.g * item.count}}g</span>
                <span class="mono rdot">L:{{item.recipe.macros.l * item.count}}g</span>
              </div>
              <div class="rdesc">{{ item.recipe.description }}</div>
            </div>
            <div class="use-badge mono">× {{ item.count }}</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>

  <RecipeModal :show="!!sel" :recipe="sel" :color="selColor" :defaultN="selN" @close="sel=null"/>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { recipes, days } from '../data/plan.js'
import RecipeModal from '../components/RecipeModal.vue'

const f = ref('all')
const batchOpen = ref([true, false])

const COOKED_KEY = 'recipes-cooked'
const cooked = ref(JSON.parse(localStorage.getItem(COOKED_KEY) || '{}'))
function isCookedR(batchIdx, rid) { return !!cooked.value[`${batchIdx}::${rid}`] }
function toggleR(batchIdx, rid) {
  const k = `${batchIdx}::${rid}`
  if (cooked.value[k]) delete cooked.value[k]
  else cooked.value[k] = true
  localStorage.setItem(COOKED_KEY, JSON.stringify(cooked.value))
}
const sel = ref(null)
const selN = ref(1)
const selColor = ref('red')

const all = Object.values(recipes)
const filtered = computed(() => {
  if (f.value === 'hypo') return all.filter(r => r.isHypo)
  if (f.value === 'meal') return all.filter(r => !r.isHypo)
  return all
})

function open(recipe, n) {
  sel.value = recipe
  selN.value = n
  selColor.value = recipe.isHypo ? 'blue' : 'red'
}

function aggregateRecipes(daySlice) {
  const map = {}
  for (const day of daySlice) {
    for (const meal of day.meals) {
      if (!meal.rid || !recipes[meal.rid]) continue
      if (!map[meal.rid]) map[meal.rid] = { recipe: recipes[meal.rid], count: 0 }
      map[meal.rid].count++
    }
  }
  const items = Object.values(map).sort((a, b) => b.count - a.count)
  return { items, totalUses: items.reduce((s, i) => s + i.count, 0) }
}

const batchRecipes = computed(() => {
  const b1 = aggregateRecipes(days.slice(0, 8))
  const b2 = aggregateRecipes(days.slice(8))
  return [
    { label: 'Batch 1 — cuisiner le 26 avril', dates: '25 avr → 2 mai · 8 jours', ...b1 },
    { label: 'Batch 2 — cuisiner le 3 mai', dates: '3 mai → 16 mai · 14 jours', ...b2 },
  ]
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
/* Phase view */
.ph-block{margin-bottom:28px}
.ph-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-left:4px solid;margin-bottom:0;cursor:pointer;user-select:none;transition:filter .15s}
.ph-header:hover{filter:brightness(1.15)}
.ph-red{background:var(--red-bg);border-color:var(--red)}
.ph-title{font-size:15px;letter-spacing:1px;margin-bottom:3px}
.ph-dates{font-size:11px;color:var(--gray);letter-spacing:1px}
.ph-right{display:flex;align-items:center;gap:12px}
.ph-meta{font-size:11px;color:var(--gray)}
.chevron{font-size:11px;color:var(--gray);transition:transform .2s;display:inline-block}
.rotated{transform:rotate(-90deg)}
.ph-note{font-size:10px;color:var(--gray);padding:7px 14px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-top:none;margin-bottom:8px;letter-spacing:.5px}
.use-badge{font-size:13px;color:var(--accent);background:rgba(255,200,0,.1);border:1px solid rgba(255,200,0,.2);padding:4px 10px;flex-shrink:0;border-radius:2px}
.cb-r{font-size:18px;color:var(--accent);flex-shrink:0;cursor:pointer;width:22px;transition:color .15s}
.cb-r:hover{color:var(--light)}
.rrow.cooked{opacity:.5}
.rrow.cooked .rname{text-decoration:line-through}
.rrow.cooked .cb-r{color:var(--gray)}
</style>
