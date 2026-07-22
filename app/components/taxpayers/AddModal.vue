<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

const schema = computed(() =>
  z.object({
    name: z.string().min(2, t('taxpayers.addModal.errors.nameTooShort')),
    email: z.string().email(t('taxpayers.addModal.errors.invalidEmail'))
  })
)
const open = ref(false)

type Schema = z.output<typeof schema.value>

const state = reactive<Partial<Schema>>({
  name: '',
  email: ''
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: t('taxpayers.addModal.successTitle'),
    description: t('taxpayers.addModal.successDescription', {
      name: event.data.name
    }),
    color: 'success'
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('taxpayers.addModal.title')"
    :description="t('taxpayers.addModal.description')"
  >
    <UButton :label="t('taxpayers.addModal.trigger')" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('taxpayers.addModal.nameLabel')"
          :placeholder="t('taxpayers.addModal.namePlaceholder')"
          name="name"
        >
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField
          :label="t('taxpayers.addModal.emailLabel')"
          :placeholder="t('taxpayers.addModal.emailPlaceholder')"
          name="email"
        >
          <UInput v-model="state.email" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            :label="t('common.actions.cancel')"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :label="t('common.actions.create')"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
