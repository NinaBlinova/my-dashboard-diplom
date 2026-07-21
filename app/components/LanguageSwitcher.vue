<script setup lang="ts">
const { locale, setLocale } = useI18n()

type LanguageCode = 'ru' | 'en'

const languages: {
  code: LanguageCode
  label: string
}[] = [
  {
    code: 'ru',
    label: 'RU'
  },
  {
    code: 'en',
    label: 'EN'
  }
]

async function changeLanguage(code: LanguageCode) {
  await setLocale(code)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <UButton
      v-for="language in languages"
      :key="language.code"
      :variant="locale === language.code ? 'solid' : 'ghost'"
      size="sm"
      @click="changeLanguage(language.code)"
    >
      {{ language.label }}
    </UButton>
  </div>
</template>
