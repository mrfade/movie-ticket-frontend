import { createError } from 'h3'
import { useUserStore } from '~~/stores/user'

export default defineNuxtRouteMiddleware((_to, from) => {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated)
    return `/login?next=${encodeURIComponent(from.fullPath)}`

  if (!userStore.isGod)
    return throwError(
      createError({
        statusCode: 401,
        statusMessage: 'You must be an admin to access this page.'
      })
    )
})
