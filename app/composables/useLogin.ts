import type { User, LoginResponse } from '~/types'
import { FetchError } from 'ofetch'

export const useLogin = () => {
  const user = useState<User | null>('user', () => null)

  const login = async (username: string, password: string) => {
    try {
      const data = await $fetch<LoginResponse>('/api/login', {
        method: 'POST',
        body: { username, password }
      })

      if (!data.success) {
        throw new Error(data.message ?? 'Login failed')
      }

      user.value = data.user

      return data
    } catch (error: unknown) {
      if (error instanceof FetchError) {
        throw new Error(error.data?.message ?? error.message)
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Login failed')
    }
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    login,
    logout
  }
}
