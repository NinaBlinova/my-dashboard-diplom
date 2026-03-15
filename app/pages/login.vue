<script setup lang="ts">
import { useLogin } from '~/composables/useLogin'
import { navigateTo } from '#imports'
import { ref } from 'vue'

const { login } = useLogin()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await login(username.value, password.value)
    if (!res?.success) {
      error.value = res?.message || 'Login failed'
      return
    }
    navigateTo('/')
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = 'Login failed'
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'login-layout'
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <UCard class="w-96 p-6 shadow-lg rounded-2xl">
      <div class="flex flex-col items-center mb-6">
        <UIcon name="i-lucide-user-circle" class="text-5xl text-primary mb-2" />

        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          С возвращением!
        </h2>

        <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
          Пожалуйста, войдите в свою учетную запись
        </p>
      </div>

      <UInput
        v-model="username"
        placeholder="Имя пользователя"
        class="mb-4 w-full"
        leading-icon="i-lucide-user"
        clearable
      />

      <UInput
        v-model="password"
        type="password"
        placeholder="Пароль"
        class="mb-4 w-full"
        leading-icon="i-lucide-lock"
        clearable
      />

      <UButton
        block
        color="primary"
        :loading="loading"
        class="mb-3"
        @click="submit"
      >
        Войти
      </UButton>

      <p v-if="error" class="text-red-500 text-sm text-center mt-2">
        {{ error }}
      </p>

      <div class="flex items-center justify-center gap-1 mt-4 text-gray-500 dark:text-gray-400 text-xs">
        <UIcon name="i-lucide-copyright" />
        <span>2026 Диплом. Все права защищены.</span>
      </div>
    </UCard>
  </div>
</template>
