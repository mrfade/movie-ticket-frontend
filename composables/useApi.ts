import { $fetch } from 'ohmyfetch'
import { FetchResult, UseFetchOptions } from 'nuxt/dist/app/composables/fetch'

function useApi<T> (
  url: string | Request,
  options?: UseFetchOptions<any>
): FetchResult<any> {
  if (!options)
    options = {} as UseFetchOptions<any>

  const config = useRuntimeConfig()
  options.baseURL = config.public.apiBase

  return $fetch<T, any>(url, options)
}

export default useApi
export { useApi }
