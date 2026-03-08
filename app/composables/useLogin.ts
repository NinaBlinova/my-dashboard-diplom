import type { User, LoginResponse } from '~/types'
import { FetchError } from 'ofetch'

export const useLogin = () => {
  const user = useState<User | null>('user', () => null)

  const login = async (username: string, password: string) => {
    try {
      const data = await $fetch<LoginResponse>('/api/profile/login', {
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

  const logout = async () => {
    const currentUser = user.value
    user.value = null
    try {
      if (currentUser) {
        await $fetch('/api/profile/logout', {
          method: 'POST',
          body: {
            username: currentUser.Username,
            user_id: currentUser.Id
          }
        })
      }
    } catch (error) {
      console.error('Logout logging failed', error)
    }
  }

  return {
    user,
    login,
    logout
  }
}
