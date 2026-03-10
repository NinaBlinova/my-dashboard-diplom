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
    <UDashboardNavbar title="Profile" />
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
              {{ user?.user_role ?? 'member' }}
            </UBadge>
          </div>
        </div>
      </UCard>
      <UCard class="mb-6">
        <template #header>
          <h3 class="font-semibold text-lg">
            Basic information
          </h3>
        </template>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-muted">
              Username
            </p>
            <p class="font-medium">
              {{ user?.Username }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Phone
            </p>
            <p class="font-medium">
              {{ user?.Phone }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Birth date
            </p>
            <p class="font-medium">
              {{ formatDate(user?.BirthDate) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Gender
            </p>
            <p class="font-medium">
              {{ user?.Gender }}
            </p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-muted">
              Address
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
            Documents
          </h3>
        </template>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-muted">
              Passport
            </p>
            <p class="font-medium">
              {{ user?.PassportSeries }} {{ user?.PassportNumber }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              Passport issue date
            </p>
            <p class="font-medium">
              {{ formatDate(user?.PassportIssueDate) }}
            </p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-muted">
              Issued by
            </p>
            <p class="font-medium">
              {{ user?.PassportIssuedBy }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              SNILS
            </p>
            <p class="font-medium">
              {{ user?.SNILS }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              INN
            </p>
            <p class="font-medium">
              {{ user?.INN }}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted">
              OMS policy
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
            About
          </h3>
        </template>
        <p class="text-muted leading-relaxed">
          {{ user?.Bio || 'No description' }}
        </p>
      </UCard>
    </UPage>
  </UDashboardPanel>
</template>
