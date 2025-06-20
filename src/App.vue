<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user';
import { onAuthStateChanged } from "firebase/auth"
import { auth } from './firebase/init'
import FloatingElement from './components/FloatingElement.vue'
import Footer from './components/Footer.vue'
import NavMenu from './components/NavMenu.vue'
import "tailwindcss";
import { useConfirm } from "primevue/useconfirm";

const userStore = useUserStore();

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    userStore.isLoggedIn = true;
    // console.log('verdadero')
  } else {
    userStore.isLoggedIn = false;
    // console.log('falso')
  }
})

</script>

<template>
  <header>
    <NavMenu />
  </header>

  <main>
    <RouterView />
  </main>

  <FloatingElement v-if="!userStore.isLoggedIn">
    <a v-if="!userStore.isLoggedIn" class="WhatsApp" href="https://wa.link/lw2t0b" target="_blank">
      <font-awesome-icon icon="fa-brands fa-whatsapp" transform="grow-50" shake
        style="--fa-animation-delay: 15s; --fa-animation-iteration-count: 3; " />
    </a>
  </FloatingElement>

  <!-- COMPONENTE FOOTER  -->
  <Footer v-if="!userStore.isLoggedIn" />

  <ConfirmDialog></ConfirmDialog>
  <Toast />


</template>

<style scoped>
a.WhatsApp {
  text-decoration: none;
  color: #25d366;
}
</style>
