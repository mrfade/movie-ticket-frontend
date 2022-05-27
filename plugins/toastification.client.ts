import Toast, { PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    transition: 'Vue-Toastification__fade',
    maxToasts: 3,
    newestOnTop: true,
    position: POSITION.BOTTOM_CENTER,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
  }

  nuxtApp.vueApp.use(Toast, options)
})
