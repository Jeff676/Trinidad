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
  try {
    setTimeout(() => {
      loading.value = false;
    }, 3000);

    logIn.value = await userStore.login(email.value, password.value)

    if (logIn.value == '') {
      toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: 'Email y/o contraseña invalidos.!', life: 3000 });
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
  <div class="grid grid-cols-3 w-2/3 mx-auto mt-10 mb-10">
    <div class="bg-welfare rounded-l-lg flex justify-content-center align-items-center">
      <img src="../assets/logo-md.svg" alt="Logo" class="p-15">
    </div>

    <div class="col-span-2 grid py-10 px-15 border-color-welfare rounded-r-lg border-1">
      <div class="text-center">
        <font-awesome-icon icon="fa-regular fa-circle-user" class="text-welfare" size="6x" />
      </div>

      <form @submit.prevent="login" class="w-full">
        <div class="flex gap-2 mt-5">
          <InputText id="email" class="w-full mt-5 mb-2" autofocus placeholder="Correo electrónico" v-model="email"
            autocomplete="on"></InputText>
        </div>

        <Password id="password" class="w-full mb-3" placeholder="Contraseña" v-model="password" autocomplete="off" fluid
          toggleMask :feedback="false">
        </Password>

        <div class="mb-5">
          <Checkbox binary disabled /> <!-- Habilitar cuando se agrege la funcionalidad -->
          <span class="ml-2">Recordar Usuario</span>
        </div>

        <div class="flex gap-3 mb-2">
          <Button label="Iniciar Sesion" class="w-full" type="submit" :loading="loading" />
        </div>
      </form>

      <div class="flex justify-content-center mt-3">
        <a href="#">¿Olvidó su contraseña?</a>
      </div>
    </div>
  </div>
</template>