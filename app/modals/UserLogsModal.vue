<script setup lang="ts">
import type { UserLog } from '~/types'

defineProps<{
  modelValue: boolean
  logs: UserLog[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => emit('update:modelValue', false)
const isAvatarChange = (log: UserLog) => log.Action.toLowerCase().includes('avatar')
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg w-11/12 md:w-1/2 p-4 shadow-lg max-h-[80vh] overflow-y-auto relative">
      <h3 class="text-lg font-bold mb-4">
        User Logs
        <UButton
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          size="sm"
          color="error"
          variant="subtle"
          aria-label="Close"
          @click="close"
        >
          <UIcon name="mdi-close" class="w-5 h-5" />
        </UButton>
      </h3>

      <div class="space-y-4">
        <div
          v-for="log in logs"
          :key="log.LogId"
          class="p-2 border-b border-gray-200"
        >
          <p>
            <strong>{{ log.Action }}:</strong>
            <span v-if="!isAvatarChange(log)">
              {{ log.AdditionalInfo }}
            </span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ new Date(log.ActionDate).toLocaleString() }}
          </p>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <UButton color="error" variant="subtle" @click="close">
          Close
        </UButton>
      </div>
    </div>
  </div>
</template>
