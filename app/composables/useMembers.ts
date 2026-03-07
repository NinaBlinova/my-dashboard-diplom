import type { User } from '~/types'

export const useMembers = () => {
  const members = useState<User[]>('members', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMembers = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<User[]>('/api/members')
      members.value = data
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to load members'
    } finally {
      loading.value = false
    }
  }

  const filteredMembers = (query: string) => {
    if (!query) return members.value
    const q = query.toLowerCase()
    return members.value.filter(
      m =>
        m.FullName.toLowerCase().includes(q)
        || m.Username.toLowerCase().includes(q)
        || m.Email.toLowerCase().includes(q)
    )
  }

  return { members, loading, error, fetchMembers, filteredMembers }
}
