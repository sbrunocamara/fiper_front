import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"


import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(fas)

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)



setActivePinia(pinia);

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
