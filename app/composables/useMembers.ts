import type { User, UserLogsResponse, RegisterUserPayload } from '~/types'

export const useMembers = () => {
  const members = useState<User[]>('members', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMembers = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<User[]>('/api/admin/members')
      members.value = data
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to load members'
    } finally {
      loading.value = false
    }
  }

  const activateUser = async (admin_id: number, target_user_id: number) => {
    try {
      await $fetch('/api/admin/user/activate_user', {
        method: 'PUT',
        body: { admin_id, target_user_id }
      })

      const user = members.value.find(u => u.Id === target_user_id)
      if (user) user.IsActive = Number(true)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to activate user'
    }
  }

  const deactivateUser = async (admin_id: number, target_user_id: number) => {
    try {
      await $fetch('/api/admin/user/deactivate_user', {
        method: 'PUT',
        body: { admin_id, target_user_id }
      })
      const user = members.value.find(u => u.Id === target_user_id)
      if (user) user.IsActive = Number(false)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to deactivate user'
    }
  }

  const registerUser = async (payload: RegisterUserPayload) => {
    try {
      await $fetch('/api/admin/user/register', {
        method: 'POST',
        body: payload
      })

      await fetchMembers()
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to register user'
    }
  }

  const editUser = async (
    admin_id: number,
    user_id: number,
    updates: Record<string, string | null>
  ) => {
    try {
      await $fetch('/api/admin/user/edit_user', {
        method: 'PUT',
        body: {
          admin_id,
          user_id,
          ...updates
        }
      })

      await fetchMembers()
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to edit user'
    }
  }

  const getUserLogs = async (user_id: number): Promise<UserLogsResponse | null> => {
    try {
      return await $fetch<UserLogsResponse>(`/api/admin/user_logs/${user_id}`)
    } catch (e: unknown) {
      const err = e as { message?: string }
      error.value = err.message ?? 'Failed to load logs'
      return null
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

  return {
    members,
    loading,
    error,

    fetchMembers,
    activateUser,
    deactivateUser,
    registerUser,
    editUser,
    getUserLogs,

    filteredMembers
  }
}
