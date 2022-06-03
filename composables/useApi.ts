import { $fetch } from 'ohmyfetch'
import { FetchResult, UseFetchOptions } from 'nuxt/dist/app/composables/fetch'
import { useUserStore } from '~/stores/user'

function useApi<T> (
  url: string | Request,
  options?: UseFetchOptions<any>
): FetchResult<any> {
  if (!options)
    options = {} as UseFetchOptions<any>

  const userStore = useUserStore()
  const config = useRuntimeConfig()

  options = {
    ...options,
    baseURL: config.public.apiBase,
    onRequest (ctx) {
      const token = userStore.getToken
      if (token) {
        ctx.options.headers = new Headers(ctx.options.headers)
        ctx.options.headers.set('Authorization', `Bearer ${token}`)
      }
      return Promise.resolve()
    }
  }

  return $fetch<T, any>(url, options)
}

export default useApi
export { useApi }
