import type { UpdateProfileResponse } from '~/types'

export const useAvatar = () => {
  async function updateAvatar(file: File, userId: number): Promise<UpdateProfileResponse> {
    const formData = new FormData()

    formData.append('avatar', file)
    formData.append('user_id', String(userId))

    return await $fetch('/api/avatar', {
      method: 'PATCH',
      body: formData
    })
  }

  function getAvatarUrl(userId: number) {
    const config = useRuntimeConfig()
    return `${config.public.backendUrl}/api/settings/avatar/${userId}`
  }

  const avatarUrl = useState<string>('avatarUrl', () => {
    const { user } = useLogin()
    return user.value ? `${getAvatarUrl(user.value.Id)}?t=${Date.now()}` : ''
  })
  return { updateAvatar, getAvatarUrl, avatarUrl }
}
