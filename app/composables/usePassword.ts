import type { UpdateProfileResponse } from '~/types'

export const usePassword = () => {
  const changePassword = async (
    user_id: number,
    old_password: string,
    new_password: string
  ): Promise<UpdateProfileResponse> => {
    return await $fetch('/api/password', {
      method: 'PATCH',
      body: {
        user_id,
        old_password,
        new_password
      }
    })
  }

  return {
    changePassword
  }
}
