import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

// ** PrimeVue Config **//
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import { definePreset } from '@primeuix/themes'

//** PrimeVue Components **//
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import OverlayBadge from 'primevue/overlaybadge'
import { Form, FormField } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import SelectButton from 'primevue/selectbutton'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Divider from 'primevue/divider'
import DatePicker from 'primevue/datepicker'
import ToggleButton from 'primevue/togglebutton'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Password from 'primevue/password'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ProgressSpinner from 'primevue/progressspinner'
import Menubar from 'primevue/menubar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import Badge from 'primevue/badge'
import Carousel from 'primevue/carousel'

import App from './App.vue'
import router from './router'
import Ripple from 'primevue/ripple'

//** FONTAWESOME **//
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
/* import specific icons */
import './fontawesome/fontawesome'
library.add(fas)

const app = createApp(App)
const pinia = createPinia()

pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

// ** PrimeVue Components **//
app.component('Button', Button)
app.component('Avatar', Avatar)
app.component('OverlayBadge', OverlayBadge)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('InputText', InputText)
app.component('Card', Card)
app.component('Checkbox', Checkbox)
app.component('Password', Password)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Menubar', Menubar)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('MultiSelect', MultiSelect)
app.component('Tag', Tag)
app.component('Select', Select)
app.component('Dialog', Dialog)
app.component('Message', Message)
app.component('Form', Form)
app.component('FormField', FormField)
app.component('InputNumber', InputNumber)
app.component('SelectButton', SelectButton)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('FloatLabel', FloatLabel)
app.component('Divider', Divider)
app.component('DatePicker', DatePicker)
app.component('ToggleButton', ToggleButton)
app.component('Badge', Badge)
app.component('Carousel', Carousel)

// ** PrimeVue Config **//
// ** Customized Preset **//
const vitality = '#0A2E4C'
const welfare = '#004a87'
const hope = '#03a5a5'
const health = '#01B0FE'
const life = '#ffffff'
const shadow = '#CBCBCB'
const danger = '#ff0000'

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
          primaryBackground: welfare,
          primaryHoverBackground: shadow,
          outlinedPrimaryBorderColor: welfare,
          // outlinedPrimaryHoverBackground: vitality,
          secondaryBackground: hope,
          secondaryHoverBackground: shadow,
          secondaryColor: life,
        },
        dark: {
          primaryBackground: vitalityDark,
          primaryHoverBackground: hopeDark,
          outlinedPrimaryBorderColor: welfareDark,
          outlinedPrimaryHoverBackground: vitalityDark,
        },
      },
    },
    menubar: {
      colorScheme: {
        light: {
          background: vitality,
          itemFocusBackground: welfare,
          borderColor: '#AARRGGBB',
          borderRadius: '0px',
          submenuBackground: vitality,
        },
        dark: {
          background: vitalityDark,
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
app.component('fa ', FontAwesomeIcon)

app.use(pinia)
app.use(router)
app.mount('#app')
