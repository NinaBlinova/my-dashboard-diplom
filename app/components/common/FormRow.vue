<script setup lang="ts">
defineProps<{
  name: string
  label: string
  description?: string
  required?: boolean
  fullWidth?: boolean
}>()
</script>

<template>
  <UFormField
    :name="name"
    :label="label"
    :description="description"
    :required="required"
    class="flex max-sm:flex-col justify-between items-start gap-4"
    :ui="fullWidth ? { container: 'w-full' } : undefined"
  >
    <slot />
  </UFormField>
</template>
