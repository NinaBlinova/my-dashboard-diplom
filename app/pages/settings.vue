<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()

const { user } = useLogin()

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: t('nav.settingsGeneral'),
      icon: 'i-lucide-user',
      to: '/settings',
      exact: true
    },

    ...(user.value?.user_role === 'admin'
      ? [{
          label: t('nav.settingsMembers'),
          icon: 'i-lucide-users',
          to: '/settings/members'
        }]
      : []),

    {
      label: t('nav.settingsSecurity'),
      icon: 'i-lucide-shield',
      to: '/settings/security'
    }
  ],

  [
    {
      label: t('nav.documentation'),
      icon: 'i-lucide-book-open',
      to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
      target: '_blank'
    }
  ]
])
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="$t('nav.settings')">
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
