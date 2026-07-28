<script setup lang="ts">
defineProps<{
  label: string
  value?: string | number | null
  span?: boolean
}>()
</script>

<template>
  <div :class="span && 'md:col-span-2'">
    <p class="text-sm text-muted">
      {{ label }}
    </p>
    <p class="font-medium">
      {{ value ?? '-' }}
    </p>
  </div>
</template>
