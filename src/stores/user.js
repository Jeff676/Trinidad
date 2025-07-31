import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '../firebase/init'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getUser } from '/src/firebase/users'


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
        var status = ''
        var userlogin = await getUser(email, password)
        status = userlogin[0].status
        localStorage.name = userlogin[0].name
        localStorage.lastname = userlogin[0].lastname
        localStorage.type = userlogin[0].type

        console.log('userlogin[0]', userlogin[0])

        if(status == 'Activo'){
          await signInWithEmailAndPassword(auth, email, password)
          
          //useUserStore.user = userlogin[0].name + ' ' + userlogin[0].lastname
          this.$router.push('/patients')
          useUserStore.user = email
        } 
        
        return status;

      }catch(error){
        return 'INVALID';
      }
      
    },

    logout() {
      signOut(auth)
        .then(() => {
          useUserStore.isLoggedIn = false;
          localStorage.clear()
          this.$router.push('/login')
        })
        .catch((error) => {
          const errorCode = error.code;
          this.errorMessage = error.message;
          alert(this.errorMessage);
        });
    },

    async createUser(email, password){
      try{
        await createUserWithEmailAndPassword(auth, email, password)
      }catch(error){
        return '';
      }

    }

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
