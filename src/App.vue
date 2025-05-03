<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase/init'

const userStore = useUserStore();

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    userStore.isLoggedIn = true;
    console.log('verdadero')
  } else {
    userStore.isLoggedIn = false;
    console.log('falso')
  }
});

</script>

<template>
  <header>
    <nav class="col-12 flex justify-content-end align-items-center nav-ppl border-round-top-lg my-0">
      <div v-if="!userStore.isLoggedIn" class="flex gap-3 align-items-center m-0">
        <RouterLink to="/" class="text-white no-underline">Inicio</RouterLink>
        <RouterLink to="/services" class="text-white no-underline">Servicios</RouterLink>
        <RouterLink to="/plans" class="text-white no-underline">Planes</RouterLink>
        <RouterLink to="/directory" class="text-white no-underline">Directorio</RouterLink>
        <RouterLink to="/blog" class="text-white no-underline">Blog</RouterLink>
        <RouterLink to="/contact" class="text-white no-underline">Contacto</RouterLink>        
      </div>
      <div v-if="userStore.isLoggedIn" class="flex gap-3 align-items-center m-0">
        <Button v-if="userStore.isLoggedIn" label="Cerrar Sesión" severity="danger"  @click="userStore.logout"></Button>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <a v-if="!userStore.isLoggedIn" class="WhatsApp" href="https://wa.link/daxgms" target="_blank">  
    <img src="/src/assets/whatsapp.png">
  </a>

  <!-- COMPONENTE FOOTER -->
    <div v-if="!userStore.isLoggedIn" class="col-12 grid p-5 footer">
      <div class="col-3">
        <h2>Conócenos</h2>
        <p>Directorio Medico</p>
        <p>Medicos Residentes</p>
        <p>Enfermería</p>
        <p>Atencion al paciente</p>
        <p>Trabaja con nosotros</p>
        <p>Conoce a nuestro personal</p>
        <p>Lee nuestro Blog</p>
        <p>Unete al Directorio Medico</p>
      </div>
      <div class="col-3">
        <h2>Servicios</h2>
        <p>Cirugía y Hospitalización</p>
        <p>UCI</p>
        <p>UCIN</p>
        <p>Radiología</p>
        <p>Cardiologia</p>
        <p>Banco de Sangre</p>
        <p>Laboratorio Clínico</p>
        <p>APS</p>        
      </div>
      <div class="col-3">
        <h2>Planes</h2>
        <p>Plan Maternidad</p>
        <p>Plan de Cirugía</p>
        <p>Plan de Cirugia infantil</p>
        <p>Otros planes de financiamiento</p>  
      </div>
      <div class="col-3">
        <h2>Contáctanos</h2>
        <p>Whatsapp:</p>
        <p>+584165017123</p>
        <p>Email:</p>
        <p>atencion@uqlatrinidad.com</p>
        <p>Direccion:</p>
        <p>Carrera 28 entre calles 9 y 10 Barquisimeto Estado Lara, Venezuela</p>
        <p>RRSS:</p>
        <p>@uqlatrinidad</p>
      </div>
      <div class="col-12">
        <div class="text-start logo">
          <img src="/src/assets/logo-large.svg" alt="Logo" class="w-8">
        </div>
      </div>
      <div class="col-12">
        <div class="text-center">
          RIF J305305099
        </div>
      </div>
    </div>
</template>
