<template>
<div class="page-pad">
  <div class="section-title d">Liste de Courses</div>
  <div class="section-desc">// 2 sessions batch cooking · 25 avril → 16 mai</div>

  <div v-for="(session, i) in sessions" :key="i" class="session-block">
    <div class="session-header" @click="open[i] = !open[i]">
      <div>
        <div class="d session-title">🛒 {{ session.label }}</div>
        <div class="mono session-dates">{{ session.dates }}</div>
      </div>
      <div class="session-right">
        <span class="mono session-count">{{ session.totalItems }} ingrédients</span>
        <span class="chevron" :class="{ rotated: !open[i] }">▼</span>
      </div>
    </div>

    <div v-show="open[i]">
      <div v-for="cat in session.cats" :key="cat.key" class="cat-block">
        <div class="cat-header">
          <span class="cat-emoji">{{ cat.emoji }}</span>
          <span class="d cat-name">{{ cat.label }}</span>
          <span class="mono cat-count">{{ cat.items.length }}</span>
        </div>
        <div class="items-list">
          <div v-for="item in cat.items" :key="item.name" class="item-row" :class="{ checked: isChecked(i, item.name) }" @click="toggle(i, item.name)">
            <span class="cb">{{ isChecked(i, item.name) ? '☑' : '☐' }}</span>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-qty mono">{{ fmtQty(item.qty, item.unit) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { days, recipes } from '../data/plan.js'

const open = ref([true, false])

const STORAGE_KEY = 'shopping-checked'
const checked = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'))

function itemKey(sessionIdx, name) { return `${sessionIdx}::${name}` }
function isChecked(sessionIdx, name) { return !!checked.value[itemKey(sessionIdx, name)] }
function toggle(sessionIdx, name) {
  const k = itemKey(sessionIdx, name)
  if (checked.value[k]) delete checked.value[k]
  else checked.value[k] = true
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checked.value))
}

const catOf = {
  'Bœuf haché 5%': 'proteins',
  'Blanc de poulet': 'proteins',
  'Blanc de poulet grillé': 'proteins',
  'Œufs entiers': 'proteins',
  'Whey vanille': 'proteins',
  'Clear whey': 'proteins',
  'Yaourt nature 0%': 'proteins',
  'Riz cuit': 'starches',
  'Pâtes cuites': 'starches',
  'Semoule cuite': 'starches',
  'Haricots verts': 'veggies',
  'Haricots rouges': 'veggies',
  'Maïs en conserve': 'veggies',
  'Tomates concassées': 'veggies',
  'Sauce tomate nature': 'sauces',
  'Sauce tomate': 'sauces',
  'Sauce tomate épicée': 'sauces',
  'Harissa': 'sauces',
  'Banane': 'fruits',
  'Banane ou pomme': 'fruits',
  'Mangue congelée': 'fruits',
  'Ananas congelé': 'fruits',
  'Fruits rouges congelés': 'fruits',
  'Fraises congelées': 'fruits',
  'Citron': 'fruits',
  'Jus de citron vert': 'fruits',
  "Huile d'olive": 'fats',
  'Cumin, paprika, ail': 'spices',
  'Cumin': 'spices',
  'Épices tikka masala': 'spices',
  'Ras el hanout': 'spices',
  'Coriandre fraîche': 'spices',
  'Ail en poudre': 'spices',
  'Épices': 'spices',
  'Feuilles de menthe': 'spices',
  'Citron + ail': 'spices',
  'Eau': 'drinks',
  'Eau froide': 'drinks',
  'Eau + électrolytes': 'drinks',
}

const CATS = [
  { key: 'proteins', label: 'Protéines', emoji: '🥩' },
  { key: 'starches', label: 'Féculents', emoji: '🍚' },
  { key: 'veggies', label: 'Légumes & Légumineuses', emoji: '🥦' },
  { key: 'fruits', label: 'Fruits', emoji: '🍌' },
  { key: 'sauces', label: 'Sauces & Conserves', emoji: '🫙' },
  { key: 'fats', label: 'Matières grasses', emoji: '🫒' },
  { key: 'spices', label: 'Épices & Aromates', emoji: '🧂' },
  { key: 'drinks', label: 'Boissons', emoji: '💧' },
  { key: 'other', label: 'Autres', emoji: '📦' },
]

function aggregateDays(daySlice) {
  const map = {}
  for (const day of daySlice) {
    for (const meal of day.meals) {
      if (!meal.rid || !recipes[meal.rid]) continue
      for (const ing of recipes[meal.rid].ingredients) {
        if (!map[ing.name]) map[ing.name] = { name: ing.name, unit: ing.unit, qty: 0 }
        map[ing.name].qty += ing.qty
      }
    }
  }
  const grouped = {}
  for (const cat of CATS) grouped[cat.key] = []
  for (const item of Object.values(map)) {
    grouped[catOf[item.name] || 'other'].push(item)
  }
  const cats = CATS
    .map(cat => ({ ...cat, items: grouped[cat.key].sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter(cat => cat.items.length > 0)
  return { cats, totalItems: Object.keys(map).length }
}

const sessions = computed(() => {
  const s1 = aggregateDays(days.slice(0, 8))
  const s2 = aggregateDays(days.slice(8))
  return [
    { label: 'Batch 1 — à acheter avant le 26 avril', dates: '25 avr → 2 mai · 8 jours', ...s1 },
    { label: 'Batch 2 — à acheter avant le 3 mai', dates: '3 mai → 16 mai · 14 jours', ...s2 },
  ]
})

function fmtQty(qty, unit) {
  if (unit === 'g' && qty >= 1000) return `${(Math.round(qty / 100) / 10).toFixed(1)} kg`
  if (unit === 'ml' && qty >= 1000) return `${(Math.round(qty / 100) / 10).toFixed(1)} L`
  const v = qty % 1 === 0 ? qty : (Math.round(qty * 10) / 10).toFixed(1)
  const u = unit === 'pièce' && qty > 1 ? 'pièces' : unit
  return `${v} ${u}`
}
</script>

<style scoped>
.session-block { margin-bottom: 24px; }
.session-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: linear-gradient(135deg, rgba(230,57,70,.1), rgba(230,57,70,.03)); border: 1px solid rgba(230,57,70,.22); cursor: pointer; user-select: none; transition: background .15s; }
.session-header:hover { background: linear-gradient(135deg, rgba(230,57,70,.15), rgba(230,57,70,.06)); }
.session-title { font-size: 14px; letter-spacing: 1px; margin-bottom: 4px; }
.session-dates { font-size: 11px; color: var(--gray); letter-spacing: 1px; }
.session-right { display: flex; align-items: center; gap: 12px; }
.session-count { font-size: 11px; color: var(--gray); }
.chevron { font-size: 11px; color: var(--gray); transition: transform .2s; display: inline-block; }
.rotated { transform: rotate(-90deg); }
.cat-block { margin-bottom: 2px; }
.cat-header { display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: var(--dark4); border-left: 3px solid rgba(255,255,255,.08); }
.cat-emoji { font-size: 14px; }
.cat-name { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; flex: 1; }
.cat-count { font-size: 10px; color: var(--gray); background: rgba(255,255,255,.06); padding: 2px 7px; border-radius: 2px; }
.items-list { border: 1px solid rgba(255,255,255,.05); border-top: none; margin-bottom: 2px; }
.item-row { display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-bottom: 1px solid rgba(255,255,255,.04); cursor: pointer; transition: background .1s; }
.item-row:last-child { border-bottom: none; }
.item-row:hover { background: rgba(255,255,255,.04); }
.item-row.checked { background: rgba(255,255,255,.01); }
.item-row.checked .item-name { text-decoration: line-through; color: var(--gray); }
.item-row.checked .item-qty { opacity: .35; }
.cb { font-size: 16px; color: var(--accent); flex-shrink: 0; width: 18px; }
.item-row.checked .cb { color: var(--gray); }
.item-name { font-size: 13px; color: var(--light); flex: 1; }
.item-qty { font-size: 12px; color: var(--accent); background: rgba(255,200,0,.07); padding: 2px 8px; border-radius: 2px; }
</style>
