<script setup lang="ts">
import type { User } from '~/types'
import { useMembers } from '~/composables/useMembers'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'saved': []
}>()

const formatDate = (d: string) => {
  if (!d) return null
  return new Date(d).toISOString().slice(0, 10)
}

const admin = useState<User | null>('user')
const adminId = computed(() => admin.value?.Id)

const { editUser } = useMembers()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const form = reactive({
  email: '',
  full_name: '',
  passport_series: '',
  passport_number: '',
  passport_issued_by: '',
  passport_issue_date: '',
  snils: '',
  inn: '',
  oms_policy: '',
  birth_date: '',
  gender: '',
  address_reg: '',
  phone: ''
})

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
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex justify-center bg-black/50 overflow-y-auto p-4"
  >
    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg w-11/12 md:w-1/2 p-4 shadow-lg max-h-[80vh] overflow-y-auto relative">
      <div class="relative flex items-center justify-between">
        <h3 class="text-lg font-semibold">
          Edit member
        </h3>

        <UButton
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          size="sm"
          color="error"
          variant="subtle"
          aria-label="Close"
          @click="open=false"
        >
          <UIcon name="mdi-close" class="w-5 h-5" />
        </UButton>
      </div>

      <div class="flex-1 overflow-y-auto space-y-4 pr-2">
        <UFormField label="Full name">
          <UInput v-model="form.full_name" />
        </UFormField>

        <UFormField label="Email">
          <UInput v-model="form.email" />
        </UFormField>

        <UFormField label="Phone">
          <UInput v-model="form.phone" />
        </UFormField>

        <UFormField label="Passport series">
          <UInput v-model="form.passport_series" />
        </UFormField>

        <UFormField label="Passport number">
          <UInput v-model="form.passport_number" />
        </UFormField>

        <UFormField label="Issued by">
          <UInput v-model="form.passport_issued_by" />
        </UFormField>

        <UFormField label="Issue date">
          <UInput v-model="form.passport_issue_date" type="date" />
        </UFormField>

        <UFormField label="SNILS">
          <UInput v-model="form.snils" />
        </UFormField>

        <UFormField label="INN">
          <UInput v-model="form.inn" />
        </UFormField>

        <UFormField label="OMS policy">
          <UInput v-model="form.oms_policy" />
        </UFormField>

        <UFormField label="Birth date">
          <UInput v-model="form.birth_date" type="date" />
        </UFormField>

        <UFormField label="Gender">
          <USelect
            v-model="form.gender"
            :items="['male', 'female']"
          />
        </UFormField>

        <UFormField label="Registration address">
          <UInput v-model="form.address_reg" />
        </UFormField>
      </div>

      <div class="flex justify-end gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open = false"
        >
          Cancel
        </UButton>

        <UButton
          color="primary"
          :loading="loading"
          @click="submit"
        >
          Save
        </UButton>
      </div>
    </div>
  </div>
</template>
