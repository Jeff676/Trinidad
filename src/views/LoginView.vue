<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const email = ref('');
const password = ref('');
const loading = ref(false);

const userStore = useUserStore();

const logIn = ref('')

const login = async () => {
    loading.value = true;
    
    try {
      setTimeout(() => {
          loading.value = false;
      }, 3000);

      logIn.value = await userStore.login(email.value, password.value)
      console.log('-----',logIn.value)
      if(logIn.value == 'Inactivo'){
        toast.add({ severity: 'warn', summary: 'ALERTA', detail: '¡El usuario está inhabilitado.!', life: 3000 });
      }

      if(logIn.value == 'Suspendido'){
        toast.add({ severity: 'warn', summary: 'ALERTA', detail: '¡El usuario está suspendido.!', life: 3000 });
      }

      if(logIn.value == ''){
        toast.add({ severity: 'error', summary: 'ALERTA', detail: '¡El usuario no existe.!', life: 3000 });
      }

      if(logIn.value == 'INVALID'){
        toast.add({ severity: 'error', summary: 'ALERTA', detail: '¡Email o contraseña incorrectos!', life: 3000 });
      }

    } catch (error) {
        //error.value = err.message
        loading.value = false

    } finally {
        loading.value = false
    }
};


</script>

<template>

  <div class="justify-content-center mt-8 mb-10">
    <div class="flex justify-content-center">
      <div class="col-5 bg-welfare border-round-lg m-3" style="width: 25%;">
        <img src="../assets/logo-md.svg" alt="Logo" class="w-full mt-5 p-5">
      </div>

      <div class="m-8">
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
            <Button label="Iniciar Sesion" class="w-full" type="submit" :loading="loading"/>
          </div>
        </form>
        <div class="flex justify-content-center mt-3">
          <a href="#">¿Olvidó su contraseña?</a>
        </div>
        {{ userStore.user }}
      </div>
    </div>
  </div>
</template>