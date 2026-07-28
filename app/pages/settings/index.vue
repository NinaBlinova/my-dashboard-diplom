<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import PageActionHeader from '~/components/common/PageActionHeader.vue'
import FormRow from '~/components/common/FormRow.vue'

const { t } = useI18n()

const fileRef = ref<HTMLInputElement>()
const { user } = useLogin()
const { updateProfile } = useSetting()
const { updateAvatar, getAvatarUrl, avatarUrl } = useAvatar()

const profileSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  username: z.string().min(2, 'Too short'),
  avatar: z.string().optional(),
  Bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

const profile = reactive<Partial<ProfileSchema>>({
  name: '',
  email: '',
  username: '',
  avatar: undefined,
  Bio: undefined
})

watchEffect(() => {
  if (user.value) {
    profile.name = user.value.FullName
    profile.email = user.value.Email
    profile.username = user.value.Username
    profile.Bio = user.value.Bio
    profile.avatar = avatarUrl.value || getAvatarUrl(user.value.Id)
  }
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  const { data } = event

  await updateProfile(data.name, data.email, data.username, data.Bio)
  toast.add({
    title: t('settings.general.toast.updatedTitle'),
    description: t('settings.general.toast.updatedDescription'),
    icon: 'i-lucide-check',
    color: 'success'
  })
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length || !user.value) return
  const file = input.files?.[0]
  if (!file || !user.value) return
  profile.avatar = URL.createObjectURL(file)
  await updateAvatar(file, user.value.Id)

  toast.add({
    title: t('settings.general.toast.avatarUpdated'),
    icon: 'i-lucide-check',
    color: 'success'
  })
}

function onFileClick() {
  fileRef.value?.click()
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <PageActionHeader :title="t('settings.general.title')">
      <template #action>
        <UButton
          form="settings"
          :label="t('common.actions.saveChanges')"
          color="neutral"
          type="submit"
          class="w-fit lg:ms-auto"
        />
      </template>
    </PageActionHeader>

    <UPageCard variant="subtle">
      <FormRow
        name="name"
        :label="t('settings.general.fullName.label')"
        :description="t('settings.general.fullName.description')"
        required
      >
        <UInput v-model="profile.name" autocomplete="off" />
      </FormRow>
      <USeparator />

      <FormRow
        name="email"
        :label="t('settings.general.email.label')"
        :description="t('settings.general.email.description')"
        required
      >
        <UInput v-model="profile.email" type="email" autocomplete="off" />
      </FormRow>
      <USeparator />

      <FormRow
        name="username"
        :label="t('settings.general.username.label')"
        :description="t('settings.general.username.description')"
        required
      >
        <UInput v-model="profile.username" type="username" autocomplete="off" />
      </FormRow>
      <USeparator />

      <FormRow
        name="avatar"
        :label="t('settings.general.avatar.label')"
        :description="t('settings.general.avatar.description')"
      >
        <div class="flex flex-wrap items-center gap-3">
          <UAvatar :src="profile.avatar" :alt="profile.name" size="lg" />
          <UButton :label="t('settings.general.avatar.choose')" color="neutral" @click="onFileClick" />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          >
        </div>
      </FormRow>
      <USeparator />

      <FormRow
        name="Bio"
        :label="t('settings.general.bio.label')"
        :description="t('settings.general.bio.description')"
        full-width
      >
        <UTextarea
          v-model="profile.Bio"
          :rows="5"
          autoresize
          class="w-full"
        />
      </FormRow>
    </UPageCard>
  </UForm>
</template>
