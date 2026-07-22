<script setup lang="ts">
import type { Taxpayer } from '~/types'

const { t } = useI18n()
const props = defineProps<{
  inn: string | null
}>()

const open = defineModel<boolean>('open')

const { data: taxpayer, pending, error, refresh } = useFetch<Taxpayer>(
  '/api/taxpayers_inn',
  {
    query: computed(() => ({ inn: props.inn })),
    immediate: false,
    server: false
  }
)

watch(open, (val) => {
  if (val && props.inn) {
    refresh()
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('taxpayers.details.title')"
    :description="t('taxpayers.details.description')"
  >
    <template #body>
      <div v-if="pending" class="space-y-4">
        <USkeleton class="h-16 w-full" />
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-4 w-1/2" />
      </div>

      <div v-else-if="error" class="text-center py-6 text-red-500">
        {{ t('taxpayers.details.loadError') }}
      </div>

      <div v-else-if="taxpayer" class="space-y-6">
        <div class="flex items-center gap-4">
          <UAvatar :src="taxpayer.avatar?.src" size="xl" />

          <div>
            <p class="text-lg font-semibold">
              {{ taxpayer.name }}
            </p>

            <p class="text-sm text-muted font-mono">
              {{ t('taxpayers.details.innLabel') }}: {{ taxpayer.INN }}
            </p>

            <p class="text-sm text-muted font-mono">
              {{ t('taxpayers.details.passportLabel') }}: {{ taxpayer.passport }}
            </p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-muted">
              {{ t('taxpayers.details.id') }}
            </p>
            <p class="font-medium">
              {{ taxpayer.id }}
            </p>
          </div>

          <div>
            <p class="text-muted">
              {{ t('taxpayers.details.registrationDistrict') }}
            </p>
            <p class="font-medium">
              {{ taxpayer.registration_district }}
            </p>
          </div>

          <div>
            <p class="text-muted">
              {{ t('taxpayers.details.hasEmployees') }}
            </p>
            <p class="font-medium">
              {{
                taxpayer.has_employees
                  ? t('common.yes')
                  : t('common.no')
              }}
            </p>
          </div>

          <div v-if="taxpayer.has_employees">
            <p class="text-muted">
              {{ t('taxpayers.details.employeesCount') }}
            </p>
            <p class="font-medium">
              {{ taxpayer.employees_count ?? 0 }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 text-muted">
        {{ t('taxpayers.details.notFound') }}
      </div>
    </template>

    <template #footer>
      <UButton
        :label="t('common.actions.close')"
        color="error"
        variant="subtle"
        @click="open = false"
      />
    </template>
  </UModal>
</template>
