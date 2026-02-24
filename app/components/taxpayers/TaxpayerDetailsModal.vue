<script setup lang="ts">
import type { Taxpayer } from '~/types'

const props = defineProps<{
  inn: string | null
}>()

const open = defineModel<boolean>('open')

const taxpayer = ref<Taxpayer | null>(null)
const pending = ref(false)

watch(
  () => props.inn,
  async (inn) => {
    if (!inn || !open.value) return

    pending.value = true
    try {
      taxpayer.value = await $fetch(`/api/taxpayers_inn?inn=${inn}`)
    } catch (e) {
      console.error('The error loading', e)
      taxpayer.value = null
    } finally {
      pending.value = false
    }
  }
)

watch(open, (val) => {
  if (!val) taxpayer.value = null
})
</script>

<template>
  <UModal
    v-model:open="open"
    title="Taxpayer details"
    description="Detailed information about taxpayer"
  >
    <template #body>
      <div v-if="pending" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
      </div>

      <div v-else-if="taxpayer" class="space-y-6">
        <div class="flex items-center gap-4">
          <UAvatar
            :src="taxpayer.avatar?.src"
            size="xl"
          />
          <div>
            <p class="text-lg font-semibold">
              {{ taxpayer.name }}
            </p>
            <p class="text-sm text-muted font-mono">
              INN: {{ taxpayer.INN }}
            </p>
            <p class="text-sm text-muted font-mono">
              Passport: {{ taxpayer.passport }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-muted">
              ID
            </p>
            <p class="font-medium">
              {{ taxpayer.id }}
            </p>
          </div>

          <div>
            <p class="text-muted">
              Registration district
            </p>
            <p class="font-medium">
              {{ taxpayer.registration_district }}
            </p>
          </div>

          <div>
            <p class="text-muted">
              Has employees
            </p>
            <p class="font-medium">
              {{ taxpayer.has_employees ? 'Yes' : 'No' }}
            </p>
          </div>

          <div v-if="taxpayer.has_employees">
            <p class="text-muted">
              Employees count
            </p>
            <p class="font-medium">
              {{ taxpayer.employees_count ?? 0 }}
            </p>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <UButton
            label="Close"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
        </div>
      </div>

      <div v-else class="text-center py-8 text-muted">
        Taxpayer not found
      </div>
    </template>
  </UModal>
</template>
