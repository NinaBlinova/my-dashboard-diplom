export const useAvatar = () => {
  const { user } = useLogin()
  const config = useRuntimeConfig()

  const avatarVersion = useState('avatarVersion', () => 0)

  function getAvatarUrl(userId: number) {
    return `${config.public.backendUrl}/api/settings/avatar/${userId}?v=${avatarVersion.value}`
  }

  const avatarUrl = computed(() => {
    if (!user.value) return ''
    return getAvatarUrl(user.value.Id)
  })

  function refreshAvatar() {
    avatarVersion.value++
  }

  async function updateAvatar(file: File, userId: number) {
    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('user_id', String(userId))

    const res = await $fetch('/api/avatar', {
      method: 'PATCH',
      body: formData
    })

    refreshAvatar()

    return res
  }

  return { avatarUrl, updateAvatar, getAvatarUrl, refreshAvatar }
}
