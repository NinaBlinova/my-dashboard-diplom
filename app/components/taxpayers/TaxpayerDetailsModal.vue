<script setup lang="ts">
import type { Taxpayer } from '~/types'

const props = defineProps<{
  inn: string | null
}>()

const open = defineModel<boolean>('open')

const { data: taxpayer, pending, error } = useFetch<Taxpayer>(
  '/api/taxpayers_inn',
  {
    query: computed(() => ({ inn: props.inn })),
    immediate: false,
    watch: [open],
    server: false
  }
)
</script>

<template>
  <UModal
    v-model:open="open"
    title="Данные налогоплательщика"
    description="Подробная информация"
  >
    <template #body>
      <!-- Skeleton -->
      <div v-if="pending" class="space-y-4">
        <USkeleton class="h-16 w-full" />
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-4 w-1/2" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-6 text-red-500">
        Ошибка загрузки данных
      </div>

      <!-- Data -->
      <div v-else-if="taxpayer" class="space-y-6">
        <div class="flex items-center gap-4">
          <UAvatar :src="taxpayer.avatar?.src" size="xl" />

          <div>
            <p class="text-lg font-semibold">
              {{ taxpayer.name }}
            </p>

            <p class="text-sm text-muted font-mono">
              ИНН: {{ taxpayer.INN }}
            </p>

            <p class="text-sm text-muted font-mono">
              Паспорт: {{ taxpayer.passport }}
            </p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 text-sm">
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
              Район регистрации
            </p>
            <p class="font-medium">
              {{ taxpayer.registration_district }}
            </p>
          </div>

          <div>
            <p class="text-muted">
              Есть сотрудники
            </p>
            <p class="font-medium">
              {{ taxpayer.has_employees ? 'Да' : 'Нет' }}
            </p>
          </div>

          <div v-if="taxpayer.has_employees">
            <p class="text-muted">
              Количество сотрудников
            </p>
            <p class="font-medium">
              {{ taxpayer.employees_count ?? 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else class="text-center py-6 text-muted">
        Налогоплательщик не найден
      </div>
    </template>

    <template #footer>
      <UButton
        label="Закрыть"
        color="error"
        variant="subtle"
        @click="open = false"
      />
    </template>
  </UModal>
</template>
