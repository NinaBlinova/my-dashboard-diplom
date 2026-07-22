<script setup lang="ts">
import type { User } from '~/types'
import { useMembers } from '~/composables/useMembers'

const { t } = useI18n()
const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'saved': []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const admin = useState<User | null>('user')
const adminId = computed(() => admin.value?.Id)

const { editUser } = useMembers()

const form = reactive({
  email: '',
  full_name: '',
  phone: '',
  passport_series: '',
  passport_number: '',
  passport_issued_by: '',
  passport_issue_date: '',
  snils: '',
  inn: '',
  oms_policy: '',
  birth_date: '',
  gender: '',
  address_reg: ''
})

const formatDate = (d: string) => {
  if (!d) return null
  return new Date(d).toISOString().slice(0, 10)
}

watch(
  () => props.user,
  (u) => {
    if (!u) return

    form.email = u.Email ?? ''
    form.full_name = u.FullName ?? ''
    form.phone = u.Phone ?? ''

    form.passport_series = u.PassportSeries ?? ''
    form.passport_number = u.PassportNumber ?? ''
    form.passport_issued_by = u.PassportIssuedBy ?? ''
    form.passport_issue_date = u.PassportIssueDate ?? ''

    form.snils = u.SNILS ?? ''
    form.inn = u.INN ?? ''
    form.oms_policy = u.OMSPolicyNumber ?? ''

    form.birth_date = u.BirthDate ?? ''
    form.gender = u.Gender ?? ''
    form.address_reg = u.Address_Reg ?? ''
  },
  { immediate: true }
)

const loading = ref(false)

const submit = async () => {
  if (!props.user || !adminId.value) return

  loading.value = true

  const payload = {
    ...form,
    birth_date: formatDate(form.birth_date),
    passport_issue_date: formatDate(form.passport_issue_date)
  }

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, v === '' ? null : v])
  )

  await editUser(adminId.value, props.user.Id, cleanPayload)

  loading.value = false
  open.value = false
  emit('saved')
}

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false
  }

  window.addEventListener('keydown', handler)

  onUnmounted(() => {
    window.removeEventListener('keydown', handler)
  })
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    @click.self="open=false"
  >
    <div
      class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
        rounded-xl w-full max-w-3xl shadow-xl
        max-h-[90vh] flex flex-col"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-user-cog" />
          <h3 class="font-semibold text-lg">
            {{ t('modals.editUser.title') }}
          </h3>
        </div>

        <UButton
          icon="i-lucide-x"
          color="error"
          variant="soft"
          @click="open=false"
        />
      </div>

      <div class="overflow-y-auto p-6 space-y-6">
        <section class="space-y-4">
          <h4 class="font-medium text-sm opacity-70">
            {{ t('modals.editUser.basicInfo') }}
          </h4>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField :label="t('modals.editUser.fullName')">
              <UInput v-model="form.full_name" icon="i-lucide-user" />
            </UFormField>

            <UFormField :label="t('modals.editUser.email')">
              <UInput v-model="form.email" type="email" icon="i-lucide-mail" />
            </UFormField>

            <UFormField :label="t('modals.editUser.phone')">
              <UInput v-model="form.phone" icon="i-lucide-phone" />
            </UFormField>

            <UFormField :label="t('modals.editUser.gender.label')">
              <USelect
                v-model="form.gender"
                :items="[
                  {
                    label: t('modals.editUser.gender.male'),
                    value: 'мужской'
                  },
                  {
                    label: t('modals.editUser.gender.female'),
                    value: 'женский'
                  }
                ]"
                icon="i-lucide-users"
              />
            </UFormField>
          </div>
        </section>

        <section class="space-y-4">
          <h4 class="font-medium text-sm opacity-70">
            {{ t('modals.editUser.passportInfo') }}
          </h4>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField :label="t('modals.editUser.series')">
              <UInput v-model="form.passport_series" />
            </UFormField>

            <UFormField :label="t('modals.editUser.number')">
              <UInput v-model="form.passport_number" />
            </UFormField>

            <UFormField :label="t('modals.editUser.issuedBy')" class="md:col-span-2">
              <UInput v-model="form.passport_issued_by" />
            </UFormField>

            <UFormField :label="t('modals.editUser.issueDate')">
              <UInput v-model="form.passport_issue_date" type="date" />
            </UFormField>
          </div>
        </section>

        <section class="space-y-4">
          <h4 class="font-medium text-sm opacity-70">
            {{ t('modals.editUser.documents') }}
          </h4>

          <div class="grid md:grid-cols-3 gap-4">
            <UFormField :label="t('modals.editUser.snils')">
              <UInput v-model="form.snils" />
            </UFormField>

            <UFormField :label="t('modals.editUser.inn')">
              <UInput v-model="form.inn" />
            </UFormField>

            <UFormField :label="t('modals.editUser.oms')">
              <UInput v-model="form.oms_policy" />
            </UFormField>
          </div>
        </section>

        <section class="space-y-4">
          <h4 class="font-medium text-sm opacity-70">
            {{ t('modals.editUser.personalInfo') }}
          </h4>

          <div class="grid md:grid-cols-2 gap-4">
            <UFormField :label="t('modals.editUser.birthDate')">
              <UInput v-model="form.birth_date" type="date" />
            </UFormField>

            <UFormField :label="t('modals.editUser.registrationAddress')" class="md:col-span-2">
              <UInput v-model="form.address_reg" />
            </UFormField>
          </div>
        </section>
      </div>

      <div class="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          color="error"
          variant="soft"
          @click="open=false"
        >
          {{ t('common.actions.cancel') }}
        </UButton>

        <UButton
          icon="i-lucide-save"
          color="primary"
          variant="soft"
          :loading="loading"
          @click="submit"
        >
          {{ t('modals.editUser.submit') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
