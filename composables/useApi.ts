import { $fetch } from 'ohmyfetch'
import { UseFetchOptions } from 'nuxt/dist/app/composables/fetch'

const useApi = (
  url: string | Request,
  options?: UseFetchOptions<any>
): Promise<any> => {
  if (!options)
    options = {} as UseFetchOptions<any>

  const config = useRuntimeConfig()
  options.baseURL = config.public.apiBase

  return $fetch(url, options)
}

export default useApi
export { useApi }
