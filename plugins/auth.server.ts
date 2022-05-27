import { useJwt } from '@vueuse/integrations/useJwt'
import cookieparser from 'cookieparser'
import { useUserStore } from '~~/stores/user'

export default defineNuxtPlugin(() => {
  const cookies = useRequestHeaders(['cookie'])
  if (!cookies.cookie) return

  const parsed = cookieparser.parse(cookies.cookie)
  if (!parsed.access_token) return

  const token = parsed.access_token
  const userStore = useUserStore()

  const { payload } = useJwt<any>(token)
  const { id, name, email } = payload.value

  userStore.setAuthenticated(true)
  userStore.setToken(token)
  userStore.setId(id)
  userStore.setName(name)
  userStore.setEmail(email)
})
