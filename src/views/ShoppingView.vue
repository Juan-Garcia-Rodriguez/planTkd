<template>
<div class="page-pad">
  <div class="section-title d">Liste de Courses</div>
  <div class="section-desc">// Quantités × 4 portions · {{ totalItems }} ingrédients · Plan complet 22 jours</div>

  <div class="alert alert-accent" style="margin-bottom:20px">
    <strong>📦 Batch cooking</strong> — Chaque quantité est calculée pour 4 portions. Idéal pour tout préparer en une fois.
  </div>

  <div v-for="cat in categorizedList" :key="cat.key" class="cat-block">
    <div class="cat-header">
      <span class="cat-emoji">{{ cat.emoji }}</span>
      <span class="d cat-name">{{ cat.label }}</span>
      <span class="mono cat-count">{{ cat.items.length }}</span>
    </div>
    <div class="items-list">
      <div v-for="item in cat.items" :key="item.name" class="item-row">
        <span class="item-name">{{ item.name }}</span>
        <span class="item-qty mono">{{ fmtQty(item.qty, item.unit) }}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { days, recipes } from '../data/plan.js'

const PORTIONS = 4

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

const totals = computed(() => {
  const map = {}
  for (const day of days) {
    for (const meal of day.meals) {
      if (!meal.rid || !recipes[meal.rid]) continue
      for (const ing of recipes[meal.rid].ingredients) {
        if (!map[ing.name]) map[ing.name] = { name: ing.name, unit: ing.unit, qty: 0 }
        map[ing.name].qty += ing.qty * PORTIONS
      }
    }
  }
  return Object.values(map)
})

const categorizedList = computed(() => {
  const grouped = {}
  for (const cat of CATS) grouped[cat.key] = []
  for (const item of totals.value) {
    const key = catOf[item.name] || 'other'
    grouped[key].push(item)
  }
  return CATS
    .map(cat => ({ ...cat, items: grouped[cat.key].sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter(cat => cat.items.length > 0)
})

const totalItems = computed(() => totals.value.length)

function fmtQty(qty, unit) {
  if (unit === 'g' && qty >= 1000) {
    const kg = (Math.round(qty / 100) / 10).toFixed(1)
    return `${kg} kg`
  }
  if (unit === 'ml' && qty >= 1000) {
    const l = (Math.round(qty / 100) / 10).toFixed(1)
    return `${l} L`
  }
  const v = qty % 1 === 0 ? qty : (Math.round(qty * 10) / 10).toFixed(1)
  const u = unit === 'pièce' && qty > 1 ? 'pièces' : unit
  return `${v} ${u}`
}
</script>

<style scoped>
.cat-block { margin-bottom: 20px; }
.cat-header { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--dark4); border-left: 3px solid rgba(255,255,255,.1); margin-bottom: 2px; }
.cat-emoji { font-size: 16px; }
.cat-name { font-size: 13px; letter-spacing: 1px; text-transform: uppercase; flex: 1; }
.cat-count { font-size: 10px; color: var(--gray); background: rgba(255,255,255,.06); padding: 2px 7px; border-radius: 2px; }
.items-list { border: 1px solid rgba(255,255,255,.05); border-top: none; }
.item-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,.04); }
.item-row:last-child { border-bottom: none; }
.item-row:hover { background: rgba(255,255,255,.02); }
.item-name { font-size: 13px; color: var(--light); }
.item-qty { font-size: 13px; color: var(--accent); background: rgba(255,200,0,.07); padding: 2px 8px; border-radius: 2px; }
</style>
