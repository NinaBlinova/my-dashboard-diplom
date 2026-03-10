<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User, UserLog } from '~/types'
import { useAvatar } from '~/composables/useAvatar'
import { useMembers } from '~/composables/useMembers'
import UserLogsModal from '~/modals/UserLogsModal.vue'
import UserEditModal from '~/modals/UserEditModal.vue'

defineProps<{ members: User[] }>()
const emit = defineEmits<{
  refresh: []
}>()

const config = useRuntimeConfig()
const { getAvatarUrl } = useAvatar()
const { activateUser, deactivateUser, getUserLogs } = useMembers()
const admin = useState<User | null>('user')
const adminId = computed(() => admin.value?.Id)

const isLogsModalOpen = ref(false)
const currentLogs = ref<UserLog[]>([])
const selectedMember = ref<User | null>(null)
const isEditModalOpen = ref(false)
const showUserLogs = async (member: User) => {
  const response = await getUserLogs(member.Id)
  currentLogs.value = response?.logs ?? []
  selectedMember.value = member
  isLogsModalOpen.value = true
}
const openEdit = (member: User) => {
  selectedMember.value = member
  isEditModalOpen.value = true
}
const items = (member: User): DropdownMenuItem[] => {
  const menu: DropdownMenuItem[] = [
    { label: 'Edit member', onSelect: () => openEdit(member) },
    { label: 'Show history', onSelect: () => showUserLogs(member) }
  ]
  if (!member.IsActive) {
    menu.push({
      label: 'Return member',
      color: 'primary',
      onSelect: async () => {
        if (!adminId.value) return
        await activateUser(adminId.value, member.Id)
        emit('refresh')
      }
    })
  }
  if (member.IsActive) {
    menu.push({
      label: 'Remove member',
      color: 'error',
      onSelect: async () => {
        if (!adminId.value) return
        await deactivateUser(adminId.value, member.Id)
        emit('refresh')
      }
    })
  }
  return menu
}
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li
      v-for="member in members"
      :key="member.Id"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          :src="member.Avatar ? `${config.public.backendUrl}${member.Avatar}` : getAvatarUrl(member.Id)"
          size="md"
        />

        <div class="text-sm min-w-0 space-y-1">
          <p class="text-highlighted font-medium truncate">
            {{ member.FullName }}
          </p>
          <p class="text-muted truncate">
            {{ member.Username }}
          </p>
          <p class="text-muted truncate">
            {{ member.Email }}
          </p>
        </div>
      </div>

      <div class="flex flex-col items-start gap-1 text-sm text-muted min-w-[200px]">
        <div>
          Role: <span class="font-medium">{{ member.user_role ?? 'member' }}</span>
        </div>
        <div>
          Status: <span class="font-medium">{{ member.IsActive ? 'Active' : 'Inactive' }}</span>
        </div>
        <div>
          Last change: <span class="font-medium">{{ new Date(member.CreatedAt).toLocaleString() }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!--        <USelect -->
        <!--          :model-value="member.user_role ?? 'member'" -->
        <!--          :items="['member', 'owner', 'admin']" -->
        <!--          color="neutral" -->
        <!--          :ui="{ value: 'capitalize', item: 'capitalize' }" -->
        <!--        /> -->

        <UDropdownMenu :items="items(member)" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
  <UserLogsModal
    v-model="isLogsModalOpen"
    :logs="currentLogs"
  />

  <UserEditModal
    v-model="isEditModalOpen"
    :user="selectedMember"
    @saved="$emit('refresh')"
  />
</template>
