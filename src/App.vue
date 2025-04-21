<script setup>
import { RouterLink, RouterView } from 'vue-router'

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
  <header>
    <nav class="col-12 flex justify-content-end align-items-center bg-primary border-round-top-lg my-0">
      <div class="flex gap-3 align-items-center m-0">
        <RouterLink to="/" class="text-white no-underline">Inicio</RouterLink>
        <RouterLink to="/services" class="text-white no-underline">Servicios</RouterLink>
        <RouterLink to="/plans" class="text-white no-underline">Planes</RouterLink>
        <RouterLink to="/directory" class="text-white no-underline">Directorio</RouterLink>
        <RouterLink to="/blog" class="text-white no-underline">Blog</RouterLink>
        <RouterLink to="/contact" class="text-white no-underline">Contacto</RouterLink>
        <OverlayBadge value="5" severity="danger">
          <Avatar class="p-overlay-badge" image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg"
            size="large" shape="circle" />
        </OverlayBadge>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>
