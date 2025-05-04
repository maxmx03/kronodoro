<script setup lang="ts">
import Clock from '@/components/Clock.vue'
import type { Pomodoro } from '@/include/pomodoro'
import { config } from '@/include/pomodoro'
import { bgm } from '@/include/bgm'
import { onBeforeUnmount, reactive, ref, watch, onMounted } from 'vue'

const initialState = {
  pomodoros: 0,
  session: 'focus',
  pause: false,
  running: false,
  notify: false,
}
const pomodoro = reactive<Pomodoro>({...initialState})
let intervalId: number = 0
const focusDuration: number = minutesToSeconds(config.focus)
const shortBreakDuration: number = minutesToSeconds(config.shortBreak)
const longBreakDuration: number = minutesToSeconds(config.longBreak)
let clock = ref<number>(focusDuration)

const focus = ref('')
const rest = ref('')

function minutesToSeconds(minutes: number): number {
  return minutes * 60
}
function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60)
}
function timeToDegree(seconds: number): number[] {
  const minutes = secondsToMinutes(seconds)
  const secondsDegree = (seconds % 60) * 6
  const minutesDegree = minutes * 6

  return [minutesDegree, secondsDegree]
}

function displayTime(): string {
  let minute: number = secondsToMinutes(clock.value)
  let second: number = clock.value % 60
  return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}

function startPomodoro() {
  pomodoro.running = true
  pomodoro.pause = false
  pomodoro.notify = false

  clock.value--
  intervalId = setInterval(() => {
    clock.value--
  }, 1000)
}
function pausePomodoro() {
  pomodoro.running = false
  pomodoro.pause = true

  clearInterval(intervalId)
}
function resetPomodoro() {
  clearInterval(intervalId)
  clock.value = focusDuration
  pomodoro.running = initialState.running
  pomodoro.pause = initialState.pause
  pomodoro.pomodoros = initialState.pomodoros
  pomodoro.notify = initialState.notify
}

onBeforeUnmount(() => {
  clearTimeout(intervalId)
})

function switchSessionFocus() {
  clock.value = focusDuration
  pomodoro.session = 'focus'
}

function switchSessionBreak() {
  if (pomodoro.pomodoros % 4 === 0) {
    clock.value = longBreakDuration
    pomodoro.session = 'long break'
  } else {
    clock.value = shortBreakDuration
    pomodoro.session = 'break'
  }
}

function nextSession() {
  pomodoro.notify = true
  switch (pomodoro.session) {
    case 'focus':
      pomodoro.pomodoros++
      switchSessionBreak()
      break
    case 'break':
      switchSessionFocus()
      break
    case 'long break':
      switchSessionFocus()
      break
    default:
      break
  }
}

watch(clock, (value) => {
  if (value === 0) {
    pausePomodoro()
    nextSession()
  }
})

function skipSession() {
  nextSession()
}

onMounted(() => {
  if (bgm.focus == '' || bgm.break == '') return
  focus.value = Music(bgm.focus)
  rest.value = Music(bgm.break)
})

watch(pomodoro, (value) => {
  const bgmIsEmpty = focus.value == '' || rest.value == ''
  //console.log(bgmIsEmpty ? 'bgm is empty' :  `bgm is not empty
  //because focus is ${focus.value} and rest is ${rest.value}`)
  if (bgmIsEmpty) return
  //console.clear()
  const pauseFocusAudio = value.pause && value.session == 'focus'
  //console.log(pauseFocusAudio ? 'focus is paused' : `focus is not paused because value.pause is: ${value.pause} and
  //session is ${value.session}`)
  if (pauseFocusAudio) focus.value.pause()

  const startFocusAudio = value.session == 'focus' && value.running && !pauseFocusAudio
  //console.log(startFocusAudio ? 'focus is playing' : 'focus is not playing')
  if (startFocusAudio) focus.value.play()
  else focus.value.pause()

  const pauseRestAudio = value.pause && value.session != 'focus'
  //console.log(pauseRestAudio ? 'rest is paused' : `rest is not paused because value.pause is: ${value.pause} and
  //session is ${value.session}`)
  if (pauseRestAudio) rest.value.pause()

  const startRestAudio = value.session != 'focus' && value.running && !pauseRestAudio
  //console.log(startRestAudio ? 'rest is playing' : 'rest is not playing')
  if (startRestAudio) rest.value.play()
  else rest.value.pause()
})

const Music = (url: string) => {
  const audio = new Audio(url)
  audio.loop = true
  return audio
}
</script>

<template>
  <div class="flex flex-col bg-indigo-950 h-screen w-screen">
    <header class="text-white flex justify-center items-center mt-3">
      <h1 class="text-8xl uppercase">{{ displayTime() }}</h1>
    </header>
    <Clock :time="timeToDegree(clock)" class="h-screen w-screen" />
    <nav class="h-24 flex items-center justify-center gap-5 text-white px-5">
      <div class="flex items-center justify-center gap-3">
        <button @click="startPomodoro" v-if="!pomodoro.running && !pomodoro.pause" class="text-2xl uppercase">
          start
        </button>
        <button
          @click="pausePomodoro"
          v-if="pomodoro.running && !pomodoro.pause"
          class="text-2xl uppercase"
          >
          pause
        </button>
        <button @click="startPomodoro" v-if="pomodoro.pause && !pomodoro.notify" class="text-2xl uppercase">resume</button>
        <button @click="resetPomodoro" v-if="pomodoro.pause && !pomodoro.notify" class="text-2xl uppercase">reset</button>
        <button @click="startPomodoro" v-if="pomodoro.notify" class="text-2xl uppercase">start {{ pomodoro.session }}?</button>
        <button @click="skipSession" v-if="pomodoro.notify" class="text-2xl uppercase">skip {{ pomodoro.session }}?</button>
      </div>
      <div>
        <a href="#/config" class="text-2xl uppercase">
          config
        </a>
      </div>
    </nav>
  </div>
</template>
