<script setup lang="ts">
import * as z from 'zod'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { UpdateProfileResponse } from '~/types'
import { useLogin } from '~/composables/useLogin'

const { changePassword } = usePassword()

const passwordSchema = z.object({
  current: z.string().min(3, 'Must be at least 3 characters'),
  new: z.string().min(3, 'Must be at least 3 characters')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Passwords must be different' })
  }
  return errors
}

const { user } = useLogin()

const submit = async (event: FormSubmitEvent<PasswordSchema>) => {
  try {
    if (!user.value) {
      alert('User not logged in')
      return
    }

    const res: UpdateProfileResponse = await changePassword(
      user.value.Id,
      event.data.current,
      event.data.new
    )

    if (res.success) {
      alert('Password updated')
      password.current = ''
      password.new = ''
    } else {
      alert(res.message)
    }
  } catch (e) {
    console.error(e)
    alert('Error updating password')
  }
}
</script>

<template>
  <UPageCard
    title="Password"
    description="Confirm your current password before setting a new one."
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
      @submit="submit"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="Current password"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="New password"
          class="w-full"
        />
      </UFormField>

      <UButton label="Update" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

<!--  <UPageCard -->
<!--    title="Account" -->
<!--    description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently." -->
<!--    class="bg-gradient-to-tl from-error/10 from-5% to-default" -->
<!--  > -->
<!--    <template #footer> -->
<!--      <UButton label="Delete account" color="error" /> -->
<!--    </template> -->
<!--  </UPageCard> -->
</template>
