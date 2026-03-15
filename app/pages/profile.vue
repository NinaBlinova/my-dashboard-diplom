<script setup lang="ts">
const { user } = useLogin()
const { avatarUrl } = useAvatar()
const formatDate = (date?: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <UDashboardPanel
    resizable
  >
    <UDashboardNavbar title="Профиль" />
    <UPage class="overflow-y-auto h-screen p-6 space-y-6">
      <UCard class="mb-6">
        <div class="flex items-center gap-4">
          <UAvatar :src="avatarUrl" :alt="user?.FullName" size="3xl" />
          <div>
            <h2 class="text-xl font-semibold">
              {{ user?.FullName }}
            </h2>
            <p class="text-sm text-muted">
              {{ user?.Email }}
            </p>
            <UBadge class="mt-2" color="primary" variant="soft">
              {{ user?.user_role ?? 'участник' }}
            </UBadge>
          </div>
        </div>
      </UCard>
      <UCard class="mb-6">
        <template #header>
          <h3 class="font-semibold text-lg">
            Основная информация
          </h3>
        </template>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-muted">
              Имя пользователя
            </p>
            <p class="font-medium">
              {{ user?.Username }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Теефон
            </p>
            <p class="font-medium">
              {{ user?.Phone }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              День Рождения
            </p>
            <p class="font-medium">
              {{ formatDate(user?.BirthDate) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Пол
            </p>
            <p class="font-medium">
              {{ user?.Gender }}
            </p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-muted">
              Адресс регистрации
            </p>
            <p class="font-medium">
              {{ user?.Address_Reg }}
            </p>
          </div>
        </div>
      </UCard>
      <UCard class="mb-6">
        <template #header>
          <h3 class="font-semibold text-lg">
            Документы
          </h3>
        </template>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-muted">
              паспортные данные
            </p>
            <p class="font-medium">
              {{ user?.PassportSeries }} {{ user?.PassportNumber }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Дата выдачи
            </p>
            <p class="font-medium">
              {{ formatDate(user?.PassportIssueDate) }}
            </p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-muted">
              Выдан
            </p>
            <p class="font-medium">
              {{ user?.PassportIssuedBy }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              СНИЛС
            </p>
            <p class="font-medium">
              {{ user?.SNILS }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              ИНН
            </p>
            <p class="font-medium">
              {{ user?.INN }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              ОМС полис
            </p>
            <p class="font-medium">
              {{ user?.OMSPolicyNumber }}
            </p>
          </div>
        </div>
      </UCard>
      <UCard class="mb-6">
        <template #header>
          <h3 class="font-semibold text-lg">
            Описание профиля
          </h3>
        </template>
        <p class="text-muted leading-relaxed">
          {{ user?.Bio || 'Нет описания' }}
        </p>
      </UCard>
    </UPage>
  </UDashboardPanel>
</template>
