<script setup lang="ts">
import { ref, computed } from 'vue'
import Pomodoro from '@/components/Pomodoro.vue'
import Config from '@/components/Config.vue'
import NotFound from '@/components/NotFound.vue'

const routes = {
  '/': Pomodoro,
  '/config': Config
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <component :is="currentView" />
</template>
