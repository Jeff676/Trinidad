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
    // async register(email, password){
    //   try{
    //     await createUserWithEmailAndPassword(auth, email, password)
    //   }catch(error){
    //     switch (error.code){
    //       case "auth/email-already-in-use":
    //         alert("El email ya esta siendo usado");
    //         break;
    //       case "auth/invalid-email":
    //         alert("El email es invalido");
    //         break;
    //     }
    //     return;
    //   }

    //   this.user = auth.currentUser;
    // },

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
