<script setup lang="ts">
import * as z from 'zod'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { UpdateProfileResponse } from '~/types'
import { useLogin } from '~/composables/useLogin'

const { t } = useI18n()
const { changePassword } = usePassword()

const passwordSchema = computed(() => z.object({
  current: z.string().min(3, t('settings.security.errors.minLength')),
  new: z.string().min(3, t('settings.security.errors.minLength'))
}))

type PasswordSchema = z.output<typeof passwordSchema.value>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: t('settings.security.errors.samePassword') })
  }
  return errors
}

const { user } = useLogin()

const submit = async (event: FormSubmitEvent<PasswordSchema>) => {
  try {
    if (!user.value) {
      alert(t('settings.security.errors.notLoggedIn'))
      return
    }

    const res: UpdateProfileResponse = await changePassword(
      user.value.Id,
      event.data.current,
      event.data.new
    )

    if (res.success) {
      alert(t('settings.security.success'))
      password.current = ''
      password.new = ''
    } else {
      alert(res.message)
    }
  } catch (e) {
    console.error(e)
    alert(t('settings.security.errors.updateError'))
  }
}
</script>

<template>
  <UPageCard
    :title="$t('settings.security.title')"
    :description="$t('settings.security.description')"
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
          :placeholder="$t('settings.security.currentPasswordPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          :placeholder="$t('settings.security.newPasswordPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <UButton :label="$t('settings.security.update')" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>
</template>
