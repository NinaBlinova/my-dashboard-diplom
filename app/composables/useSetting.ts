import type { User, UpdateProfileResponse } from '~/types'

export const useSetting = () => {
  const user = useState<User | null>('user')

  const updateProfile = async (
    name: string,
    email: string,
    username: string,
    bio?: string
  ) => {
    const data = await $fetch<UpdateProfileResponse>('/api/profile/settings', {
      method: 'PUT',
      body: {
        user_id: user.value?.Id,
        full_name: name,
        email,
        username,
        bio
      }
    })

    if (data.success && user.value) {
      user.value.FullName = name
      user.value.Email = email
      user.value.Username = username
      user.value.Bio = bio
    }

    return data
  }

  return {
    updateProfile
  }
}
