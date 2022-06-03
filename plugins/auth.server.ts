import cookieparser from 'cookieparser'
import { useUserStore } from '~~/stores/user'

export default defineNuxtPlugin(async () => {
  const cookies = useRequestHeaders(['cookie'])
  if (!cookies.cookie) return

  const parsed = cookieparser.parse(cookies.cookie)
  if (!parsed.access_token) return

  const token = parsed.access_token
  const userStore = useUserStore()

  await userStore.loginWithToken(token)
})
