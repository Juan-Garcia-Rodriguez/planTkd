<template>
  <nav class="navbar">
    <RouterLink to="/" class="logo"><span class="d">TKD</span><span class="mono logo-sub">PLAN</span></RouterLink>
    <div class="nav-links">
      <RouterLink to="/" class="nl" active-class="nl-active" exact>
        <span class="ni">🏠</span><span class="nt">Accueil</span>
      </RouterLink>
      <RouterLink to="/phase/1" class="nl nl-red" active-class="nl-active">
        <span class="ni">①</span><span class="nt">Phase 1</span>
      </RouterLink>
      <RouterLink to="/phase/2" class="nl nl-green" active-class="nl-active">
        <span class="ni">②</span><span class="nt">Phase 2</span>
      </RouterLink>
      <RouterLink to="/phase/3" class="nl nl-blue" active-class="nl-active">
        <span class="ni">③</span><span class="nt">Phase 3</span>
      </RouterLink>
      <RouterLink to="/recipes" class="nl" active-class="nl-active">
        <span class="ni">🍽️</span><span class="nt">Recettes</span>
      </RouterLink>
      <RouterLink to="/shopping" class="nl" active-class="nl-active">
        <span class="ni">🛒</span><span class="nt">Courses</span>
      </RouterLink>
    </div>
  </nav>
  <main>
    <RouterView v-slot="{Component}">
      <Transition name="fade" mode="out-in">
        <component :is="Component"/>
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
.navbar{position:sticky;top:0;z-index:100;background:rgba(13,13,13,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.05);display:flex;align-items:center;padding:0 16px;height:54px;gap:20px}
.logo{display:flex;align-items:baseline;gap:6px}
.logo .d{font-family:var(--font-d);font-size:24px;color:var(--red);line-height:1}
.logo-sub{font-size:9px;color:var(--gray);letter-spacing:2px;text-transform:uppercase}
.nav-links{display:flex;align-items:center;gap:2px;overflow-x:auto}
.nl{display:flex;align-items:center;gap:5px;padding:5px 10px;font-family:var(--font-m);font-size:11px;letter-spacing:.5px;color:var(--gray);border-radius:2px;white-space:nowrap;text-transform:uppercase;transition:all .15s}
.nl:hover{background:rgba(255,255,255,.04);color:var(--light)}
.nl-active{background:rgba(255,255,255,.06);color:var(--light)}
.nl-red.nl-active{background:var(--red-bg);color:var(--red)}
.nl-green.nl-active{background:var(--green-bg);color:var(--green)}
.nl-blue.nl-active{background:var(--blue-bg);color:var(--blue)}
.ni{font-size:13px}
@media(max-width:560px){.nt{display:none}.nl{padding:5px 8px}.ni{font-size:15px}}
</style>
