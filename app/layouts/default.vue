<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const { user } = useLogin()
const { t } = useI18n()

const open = ref(false)

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: t('nav.home'),
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('nav.taxpayers'),
  icon: 'i-lucide-users',
  to: '/taxpayers',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('nav.models'),
  icon: 'i-lucide-brain',
  to: '/models',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('nav.settings'),
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: t('nav.settingsGeneral'),
    to: '/settings',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, ...(user.value?.user_role === 'admin'
    ? [{
        label: t('nav.settingsMembers'),
        to: '/settings/members',
        onSelect: () => { open.value = false }
      }]
    : []),
  // {
  //   label: t('nav.settingsNotifications'),
  //   to: '/settings/notifications',
  //   onSelect: () => {
  //     open.value = false
  //   }
  // },
  {
    label: t('nav.settingsSecurity'),
    to: '/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}]
] satisfies NavigationMenuItem[][])

const groups = computed(() => [{
  id: 'links',
  label: t('nav.search.goTo'),
  items: links.value.flat()
}, {
  id: 'code',
  label: t('nav.search.code'),
  items: [{
    id: 'source',
    label: t('nav.search.viewPageSource'),
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: t('cookieConsent.message'),
    duration: 0,
    close: false,
    actions: [{
      label: t('cookieConsent.accept'),
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: t('cookieConsent.optOut'),
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <div
          v-if="!collapsed"
          class="px-4 py-3"
        >
          <LanguageSwitcher />
        </div>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
