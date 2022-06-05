import { useUserStore } from '~~/stores/user'

export default defineNuxtRouteMiddleware((_to, from) => {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated)
    return `/login?next=${encodeURIComponent(from.fullPath)}`
})
