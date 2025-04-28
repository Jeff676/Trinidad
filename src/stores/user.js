import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { auth } from "../firebase/init";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const error = ref('');

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null,
    };
  },

  actions: {
    async login(email, password){
      error.value = '';
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario autenticado');
        this.$router.push('/doctors')
        this.user = email;
      } catch (err) {
        if(err.message == "auth/user-not-found"){
            alert("El email es invalido");
        }else if(err.message == "auth/wrong-password"){
            alert("El password es invalido");
        }else{
          alert("Error al iniciar sesión");
        }
        console.error('Error al iniciar sesión:', err.message);
        error.value = 'Correo electrónico o contraseña incorrectos.';
      }
    }
    // async login(email, password){
    //   try{
    //     await signInWithEmailAndPassword(auth, email, password)
    //   }catch(error){
    //     switch (error.code){
    //       case "auth/user-not-found":
    //         alert("El email es invalido");
    //         break;
    //       case "auth/wrong-password":
    //         alert("El password es invalido");
    //         break;
    //     }

    //     return;
    //   }
    //   this.user = auth.currentUser;
    //   this.$router.push('/doctors')
    //   console.log('usuario logeado.!')
    //   console.log(auth.currentUser.email)
    // },    

  },
});
  

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
