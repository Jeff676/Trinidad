import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '../firebase/init'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { endAt } from 'firebase/firestore';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null,
      isLoggedIn: true,
    }
  },

  actions: {

    async login(email, password){
      try{
        await signInWithEmailAndPassword(auth, email, password)
      }catch(error){

        return '';
      }
      this.$router.push('/patients')
      useUserStore.user = email
      return email;
    },

    logout() {
      signOut(auth)
        .then(() => {
          useUserStore.isLoggedIn = false;
          this.$router.push('/')
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },

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
