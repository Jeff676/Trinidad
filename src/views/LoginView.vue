<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/counter';
import { auth } from '../firebase/init'


const email = ref('');
const password = ref('');

const userStore = useUserStore();

const login = () => {
    userStore.login(email.value, password.value);
}
console.log('***', auth)

</script>

<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="login__input">
          <input type="text" required v-model="email"/>
          <label>Email</label>
        </div>
        <div class="login__input">
          <input type="password" required v-model="password"/>
          <label>Contraseña</label>
        </div>
  
        <button class="login__submit" type="submit">Login</button>
      </form>
    </div>
  </template>
  