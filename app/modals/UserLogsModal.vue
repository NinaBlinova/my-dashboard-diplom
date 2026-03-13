<script setup lang="ts">
import type { UserLog } from '~/types'

const props = defineProps<{
  modelValue: boolean
  logs: UserLog[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const isAvatarChange = (log: UserLog) =>
  log.Action.toLowerCase().includes('avatar')

const close = () => (open.value = false)

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
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
        rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]"
      @click.stop
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-lucide-history" />
          User Logs
        </h3>

        <UButton
          icon="i-lucide-x"
          color="error"
          variant="soft"
          @click="open=false"
        />
      </div>

      <!-- BODY -->
      <div class="overflow-y-auto p-6 space-y-4">
        <div
          v-for="log in logs"
          :key="log.LogId"
          class="p-3 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <p class="font-medium">
            {{ log.Action }}
          </p>

          <p
            v-if="!isAvatarChange(log)"
            class="text-sm opacity-80 mt-1"
          >
            {{ log.AdditionalInfo }}
          </p>

          <p class="text-xs text-gray-500 mt-2">
            {{ new Date(log.ActionDate).toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="flex justify-end p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton
          color="error"
          variant="soft"
          @click="open=false"
        >
          Close
        </UButton>
      </div>
    </div>
  </div>
</template>
