import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '../firebase/init'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null,
    }
  },

  actions: {
    async login(email, password) {
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            alert('El email es invalido')
            break
          case 'auth/wrong-password':
            alert('El password es invalido')
            break
        }

        return
      }
      this.user = auth.currentUser
      this.$router.push('/panel')
      console.log('usuario logeado.!')
      console.log(auth.currentUser.email)
    },
  },
})

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
