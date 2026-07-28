<script setup lang="ts">
import InfoRow from '~/components/common/InfoRow.vue'
import SectionCard from '~/components/common/SectionCard.vue'

const { t } = useI18n()
const { user } = useLogin()
const { avatarUrl } = useAvatar()
const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : '-'
</script>

<template>
  <UDashboardPanel resizable>
    <UDashboardNavbar :title="t('profile.title')" />
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
              {{ user?.user_role ?? t('profile.roleFallback') }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <SectionCard :title="t('profile.basicInfo')">
        <div class="grid md:grid-cols-2 gap-6">
          <InfoRow :label="t('profile.username')" :value="user?.Username" />
          <InfoRow :label="t('profile.phone')" :value="user?.Phone" />
          <InfoRow :label="t('profile.birthDate')" :value="formatDate(user?.BirthDate)" />
          <InfoRow :label="t('profile.gender')" :value="user?.Gender" />
          <InfoRow :label="t('profile.registrationAddress')" :value="user?.Address_Reg" span />
        </div>
      </SectionCard>

      <SectionCard :title="t('profile.documents')">
        <div class="grid md:grid-cols-2 gap-6">
          <InfoRow :label="t('profile.passportData')" :value="`${user?.PassportSeries ?? ''} ${user?.PassportNumber ?? ''}`" />
          <InfoRow :label="t('profile.passportIssueDate')" :value="formatDate(user?.PassportIssueDate)" />
          <InfoRow :label="t('profile.passportIssuedBy')" :value="user?.PassportIssuedBy" span />
          <InfoRow :label="t('profile.snils')" :value="user?.SNILS" />
          <InfoRow :label="t('profile.inn')" :value="user?.INN" />
          <InfoRow :label="t('profile.omsPolicy')" :value="user?.OMSPolicyNumber" />
        </div>
      </SectionCard>

      <SectionCard :title="t('profile.bio')">
        <p class="text-muted leading-relaxed">
          {{ user?.Bio || t('profile.noBio') }}
        </p>
      </SectionCard>
    </UPage>
  </UDashboardPanel>
</template>
