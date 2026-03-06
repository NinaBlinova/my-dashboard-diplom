import type { User, LoginResponse } from '~/types'

export const useLogin = () => {
  const user = useState<User | null>('user', () => null)

  const login = async (username: string, password: string) => {
    const { data, error } = await useFetch<LoginResponse>('/api/login', {
      method: 'POST',
      body: { username, password }
    })

    if (error.value) {
      throw new Error(error.value.statusMessage)
    }

    if (!data.value) {
      throw new Error('No response from server')
    }

    if (!data.value.success) {
      throw new Error(data.value.message ?? 'Login failed')
    }

    return data.value
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
