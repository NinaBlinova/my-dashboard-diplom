<script setup lang="ts">
import * as z from 'zod'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { UpdateProfileResponse } from '~/types'
import { useLogin } from '~/composables/useLogin'

const { changePassword } = usePassword()

const passwordSchema = z.object({
  current: z.string().min(3, 'Должно быть не менее 3 символов'),
  new: z.string().min(3, 'Должно быть не менее 3 символов')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Новый пароль должен быть другим' })
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
      alert('Пароль обновился')
      password.current = ''
      password.new = ''
    } else {
      alert(res.message)
    }
  } catch (e) {
    console.error(e)
    alert('Ошибка при обновлении пароля')
  }
}
</script>

<template>
  <UPageCard
    title="Пароль"
    description="Подтвердите свой текущий пароль, прежде чем устанавливать новый."
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
          placeholder="Текущий пароль"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="Новый пароль"
          class="w-full"
        />
      </UFormField>

      <UButton label="Обновить" class="w-fit" type="submit" />
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
