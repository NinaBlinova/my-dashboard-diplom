<script setup lang="ts">
import RegisterUserModal from '~/modals/RegisterUserModal.vue'

const { members, fetchMembers } = useMembers()

onMounted(fetchMembers)

const q = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return (
      member.FullName.search(new RegExp(q.value, 'i')) !== -1
      || member.Username.search(new RegExp(q.value, 'i')) !== -1
    )
  })
})

const refresh = async () => {
  await fetchMembers()
}

const registerModal = ref(false)
</script>

<template>
  <div>
    <UPageCard
      title="Участники системы"
      description="Добавить нового участника."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Добавить пользователя"
        color="neutral"
        class="w-fit lg:ms-auto"
        @click="registerModal = true"
      />
    </UPageCard>

    <UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Искать участника"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" @refresh="refresh" />
    </UPageCard>
    <RegisterUserModal
      v-model="registerModal"
      @created="refresh"
    />
  </div>
</template>
