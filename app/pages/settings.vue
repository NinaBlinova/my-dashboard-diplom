<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user } = useLogin()

const links = [[{
  label: 'Общие',
  icon: 'i-lucide-user',
  to: '/settings',
  exact: true
},
...(user.value?.user_role === 'admin'
  ? [{
      label: 'Участники системы',
      icon: 'i-lucide-users',
      to: '/settings/members'
    }]
  : []),
// {
//   label: 'Уведомления',
//   icon: 'i-lucide-bell',
//   to: '/settings/notifications'
// },
{
  label: 'Безопасность',
  icon: 'i-lucide-shield',
  to: '/settings/security'
}], [{
  label: 'Documentation',
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Настройки">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
