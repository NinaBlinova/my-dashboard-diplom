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
    await login(username.value, password.value)
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
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <UCard class="w-96 p-6 shadow-lg rounded-2xl">
      <div class="flex flex-col items-center mb-6">
        <UIcon name="user-circle" class="text-5xl text-blue-600 mb-2" />
        <h2 class="text-2xl font-semibold text-gray-800">
          Welcome Back
        </h2>
        <p class="text-gray-500 text-sm">
          Please login to your account
        </p>
      </div>

      <UInput
        v-model="username"
        placeholder="Username"
        class="mb-4 w-full"
        leading-icon="user"
        clearable
      />

      <UInput
        v-model="password"
        type="password"
        placeholder="Password"
        class="mb-4 w-full"
        leading-icon="lock"
        clearable
      />

      <UButton
        block
        color="primary"
        :loading="loading"
        class="mb-3"
        @click="submit"
      >
        Login
      </UButton>

      <p v-if="error" class="text-red-500 text-sm text-center mt-2">
        {{ error }}
      </p>

      <div class="text-center mt-4 text-gray-500 text-xs">
        © 2026 MyDashboard. All rights reserved.
      </div>
    </UCard>
  </div>
</template>
