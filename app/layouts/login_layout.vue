<script setup lang="ts">
const colorMode = useColorMode() // Можно использовать для динамического фона, иначе убрать
</script>

<template>
  <UApp :class="colorMode.value === 'dark' ? 'bg-gray-900' : 'bg-gray-50'" class="min-h-screen flex items-center justify-center">
    <NuxtPage />
  </UApp>
</template>
