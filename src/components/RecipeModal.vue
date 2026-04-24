<template>
  <Teleport to="body">
    <Transition name="mfade">
      <div v-if="show" class="overlay" @click.self="$emit('close')">
        <div class="box" :class="`box-${color}`">
          <div class="bh">
            <div class="bh-left">
              <span class="emoji">{{ recipe.emoji }}</span>
              <div>
                <h2 class="d bname">{{ recipe.name }}</h2>
                <span class="tag" :class="`tag-${color}`">{{ recipe.tag }}</span>
              </div>
            </div>
            <button class="close" @click="$emit('close')">✕</button>
          </div>
          <div class="bb">
            <p class="desc mono">{{ recipe.description }}</p>
            <div class="mcrow">
              <div class="mp kcal"><span class="d mv">{{ recipe.kcal * n }}</span><span class="mono ml">kcal</span></div>
              <div class="mp prot"><span class="d mv">{{ recipe.macros.p * n }}g</span><span class="mono ml">protéines</span></div>
              <div class="mp gluc"><span class="d mv">{{ recipe.macros.g * n }}g</span><span class="mono ml">glucides</span></div>
              <div class="mp lip"><span class="d mv">{{ recipe.macros.l * n }}g</span><span class="mono ml">lipides</span></div>
            </div>
            <div class="portions">
              <span class="mono plbl">Portions</span>
              <div class="stepper">
                <button @click="n=Math.max(1,n-1)">−</button>
                <span class="d pval">{{ n }}</span>
                <button @click="n++">+</button>
              </div>
              <span v-if="n>1" class="mono pnote">→ Batch pour {{ n }} repas</span>
            </div>
            <div class="slbl mono">Ingrédients</div>
            <ul class="ings">
              <li v-for="i in recipe.ingredients" :key="i.name">
                <span>{{ i.name }}</span>
                <span class="mono qty">{{ fq(i.qty*n) }} {{ i.unit }}</span>
              </li>
            </ul>
            <div class="slbl mono">Préparation</div>
            <ol class="steps">
              <li v-for="(s,i) in recipe.steps" :key="i">{{ s }}</li>
            </ol>
            <div v-if="recipe.isHypo" class="alert alert-blue" style="margin-top:12px;font-size:12px;">
              ❄️ <strong>Congélation :</strong> 2 mois max. Sortir la veille au frigo ou 30-45 min avant.
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ show: Boolean, recipe: Object, color: { default: 'red' }, defaultN: { default: 1 } })
defineEmits(['close'])
const n = ref(1)
watch(() => props.show, v => { if(v) n.value = props.defaultN })
function fq(v){ return v%1===0?v:Math.round(v*10)/10 }
</script>
<style scoped>
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:999;display:flex;align-items:flex-end;justify-content:center;padding:12px}
@media(min-width:600px){.overlay{align-items:center}}
.box{background:var(--dark2);border:1px solid rgba(255,255,255,.08);border-top:3px solid;width:100%;max-width:520px;max-height:92vh;overflow-y:auto;border-radius:2px}
.box-red{border-top-color:var(--red)}.box-green{border-top-color:var(--green)}.box-blue{border-top-color:var(--blue)}.box-accent{border-top-color:var(--accent)}.box-gold{border-top-color:var(--gold)}
.bh{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 18px;background:var(--dark3);border-bottom:1px solid rgba(255,255,255,.05);position:sticky;top:0;z-index:1}
.bh-left{display:flex;align-items:center;gap:12px}
.emoji{font-size:26px}
.bname{font-size:20px;letter-spacing:1px;margin-bottom:4px}
.close{background:none;border:1px solid rgba(255,255,255,.1);color:var(--gray);cursor:pointer;font-size:13px;padding:5px 9px;border-radius:2px;transition:all .15s}
.close:hover{color:var(--light);border-color:rgba(255,255,255,.25)}
.bb{padding:16px 18px}
.desc{font-size:12px;color:var(--gray2);margin-bottom:14px;letter-spacing:.3px}
.mcrow{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
.mp{background:var(--dark4);border:1px solid rgba(255,255,255,.05);padding:10px 8px;text-align:center}
.mv{display:block;font-size:22px;line-height:1}
.ml{display:block;font-size:9px;color:var(--gray);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.mp.kcal .mv{color:var(--red)}.mp.prot .mv{color:var(--accent)}.mp.gluc .mv{color:var(--green)}.mp.lip .mv{color:var(--blue)}
.portions{display:flex;align-items:center;gap:10px;background:var(--dark4);border:1px solid rgba(255,255,255,.05);padding:10px 12px;margin-bottom:14px}
.plbl{font-size:10px;color:var(--gray);text-transform:uppercase;letter-spacing:1px}
.stepper{display:flex;align-items:center;border:1px solid rgba(255,255,255,.1);border-radius:2px;overflow:hidden}
.stepper button{background:var(--dark5);border:none;color:var(--light);cursor:pointer;font-size:16px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:background .1s}
.stepper button:hover{background:rgba(255,255,255,.08)}
.pval{font-size:20px;width:38px;text-align:center;color:var(--red)}
.pnote{font-size:11px;color:var(--accent)}
.slbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--gray);margin-bottom:8px;margin-top:12px}
.ings{list-style:none;display:flex;flex-direction:column;gap:2px}
.ings li{display:flex;justify-content:space-between;align-items:center;padding:7px 12px;background:var(--dark4);font-size:13px}
.ings li:nth-child(even){background:var(--dark5)}
.qty{font-size:11px;color:var(--accent)}
.steps{padding-left:18px;display:flex;flex-direction:column;gap:7px}
.steps li{font-size:13px;color:var(--gray2);line-height:1.5}
.mfade-enter-active,.mfade-leave-active{transition:opacity .18s}
.mfade-enter-from,.mfade-leave-to{opacity:0}
</style>
