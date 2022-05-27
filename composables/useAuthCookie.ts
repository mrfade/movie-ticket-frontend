import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies(['access_token'])

const setAccessToken = (token: string): void => {
  cookies.set('access_token', token, {
    maxAge: (60 * 60 * 24),
    secure: process.env.NODE_ENV === 'production'
  })
}

const getAccessToken = (): string => {
  return cookies.get('access_token')
}

const removeAccessToken = (): void => {
  cookies.remove('access_token')
}

export {
  setAccessToken,
  getAccessToken,
  removeAccessToken
}
