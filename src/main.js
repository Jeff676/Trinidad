import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// ** PrimeVue Config **//
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import { definePreset } from '@primeuix/themes'
import '/node_modules/primeflex/primeflex.css'

//** PrimeVue Components **//
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import OverlayBadge from 'primevue/overlaybadge'

import App from './App.vue'
import router from './router'
import Ripple from 'primevue/ripple'

//** FONTAWESOME **//
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import './fontawesome/fontawesome'

const app = createApp(App)

// ** PrimeVue Components **//
app.component('Button', Button)
app.component('Avatar', Avatar)
app.component('OverlayBadge', OverlayBadge)

// ** PrimeVue Config **//
// ** Customized Preset **//
const vitality = '#0A2E4C'
const hope = '#004A87'
const welfare = '#03A5A5'
const health = '#01B0FE'
const life = '#ffffff'
const shadow = '#CBCBCB'

// ** Dark Mode Preset **//
const vitalityDark = '#71D49E'
const hopeDark = '#EEFBF4'
const welfareDark = '#B5BFBA'
const healthDark = '#F6F5F5'
const lifeDark = '#ffffff'
const shadowDark = '#4B4848'

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.50}',
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          primaryBackground: vitality,
          primaryHoverBackground: vitality,
          outlinedPrimaryBorderColor: welfare,
          // outlinedPrimaryHoverBackground: vitality,
        },
        dark: {
          primaryBackground: vitalityDark,
          primaryHoverBackground: hopeDark,
          outlinedPrimaryBorderColor: welfareDark,
          outlinedPrimaryHoverBackground: vitalityDark,
        },
      },
    },
  },
})

app.directive('ripple', Ripple)

app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})
// ** END PrimeVue Config **//

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
