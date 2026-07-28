<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <h3 class="font-semibold text-lg">
        {{ title }}
      </h3>
    </template>
    <slot />
  </UCard>
</template>
