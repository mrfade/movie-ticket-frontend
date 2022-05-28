import cookieparser from 'cookieparser'
import { useUserStore, parseToken } from '~~/stores/user'

export default defineNuxtPlugin(() => {
  const cookies = useRequestHeaders(['cookie'])
  if (!cookies.cookie) return

  const parsed = cookieparser.parse(cookies.cookie)
  if (!parsed.access_token) return

  const token = parsed.access_token
  const userStore = useUserStore()

  const { id, name, email } = parseToken(token)

  userStore.setAuthenticated(true)
  userStore.setToken(token)
  userStore.setId(id)
  userStore.setName(name)
  userStore.setEmail(email)
})
