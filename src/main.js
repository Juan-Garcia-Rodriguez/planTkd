import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomeView from './views/HomeView.vue'
import PhaseView from './views/PhaseView.vue'
import DayView from './views/DayView.vue'
import RecipesView from './views/RecipesView.vue'
import ShoppingView from './views/ShoppingView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/phase/:id', component: PhaseView },
    { path: '/day/:id', component: DayView },
    { path: '/recipes', component: RecipesView },
    { path: '/shopping', component: ShoppingView },
  ],
  scrollBehavior: () => ({ top: 0 })
})

createApp(App).use(router).mount('#app')
