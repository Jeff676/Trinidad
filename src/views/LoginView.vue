<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { auth } from '../firebase/init'

const email = ref('');
const password = ref('');

const userStore = useUserStore();

const login = () => {
  userStore.login(email.value, password.value);
}

</script>

<template>
  <div class="grid surface-100 col-6 mx-auto my-8 border-round-lg shadow-2xl ">
    <div class="col-5 bg-welfare border-round-lg">
      <img src="../assets/logo-md.svg" alt="Logo" class="w-full mt-5 p-5">
    </div>

    <div class="col-7  mt-5 p-5 ">
      <div class="text-center">
        <font-awesome-icon icon="fa-regular fa-circle-user" class="text-welfare" size="6x" />
      </div>
      <form @submit.prevent="login">
        <InputText id="email" class="w-full mt-5 mb-2" autofocus placeholder="Correo electrónico" v-model="email"
          autocomplete="on"></InputText>
        <Password id="password" class="w-full mb-3" placeholder="Contraseña" v-model="password" autocomplete="off" fluid
          toggleMask></Password>
        <div class="mb-5">
          <Checkbox binary disabled /> <!-- Habilitar cuando se agrege la funcionalidad -->
          <span class="ml-2">Recordar Usuario</span>
        </div>
        <div class="flex gap-3 mb-2">
          <Button label="Iniciar Sesion" class="w-full" type="submit" />
        </div>
      </form>
      <div class="flex justify-content-center mt-3">
        <a href="#">¿Olvidó su contraseña?</a>
      </div>
      <!-- <p class="text-red-500">gg {{ errorMsg }} </p> -->
      {{ userStore.user }}
    </div>

  </div>
</template>