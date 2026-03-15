<script setup lang="ts">
import type { User } from '~/types'
import { useMembers } from '~/composables/useMembers'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'created': []
}>()

const formatDate = (d: string) => {
  if (!d) return undefined
  return new Date(d).toISOString().slice(0, 10)
}

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const admin = useState<User | null>('user')
const adminId = computed(() => admin.value?.Id)

const { registerUser } = useMembers()

const form = reactive({
  username: '',
  email: '',
  password: '',
  full_name: '',
  phone: '',
  gender: '',
  birth_date: ''
})

const loading = ref(false)

const submit = async () => {
  if (!adminId.value) return

  loading.value = true

  await registerUser({
    admin_id: adminId.value,
    username: form.username,
    email: form.email,
    password: form.password,
    full_name: form.full_name,
    phone: form.phone,
    gender: form.gender,
    birth_date: formatDate(form.birth_date)
  })

  loading.value = false
  open.value = false
  emit('created')
}

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

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
        rounded-xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]"
      @click.stop
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-lucide-user-plus" />
          Регистрация нового пользователя
        </h3>

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          @click="open=false"
        />
      </div>

      <!-- BODY -->
      <div class="p-6 space-y-4 overflow-y-auto">
        <UFormField label="Имя пользователя">
          <UInput v-model="form.username" icon="i-lucide-user" />
        </UFormField>

        <UFormField label="ФИО">
          <UInput v-model="form.full_name" />
        </UFormField>

        <UFormField label="Email">
          <UInput v-model="form.email" type="email" icon="i-lucide-mail" />
        </UFormField>

        <UFormField label="Пароль">
          <UInput v-model="form.password" type="password" icon="i-lucide-lock" />
        </UFormField>

        <UFormField label="Телефон">
          <UInput v-model="form.phone" icon="i-lucide-phone" />
        </UFormField>

        <UFormField label="Пол">
          <USelect
            v-model="form.gender"
            :items="['мужской', 'женский']"
          />
        </UFormField>

        <UFormField label="День рождения">
          <UInput v-model="form.birth_date" type="date" />
        </UFormField>
      </div>

      <!-- FOOTER -->
      <div class="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open=false"
        >
          Отменить
        </UButton>

        <UButton
          icon="i-lucide-user-plus"
          color="primary"
          :loading="loading"
          @click="submit"
        >
          Создать пользователя
        </UButton>
      </div>
    </div>
  </div>
</template>
