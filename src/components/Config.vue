<script setup lang="ts">
import { ref } from 'vue';
import { bgm } from '@/include/bgm'

const changeFocusAudio = (event) => {
  const files = event.target.files
  bgm.focus = URL.createObjectURL(files[0])
}
const changeBreakAudio = (event) => {
  const files = event.target.files
  bgm.break = URL.createObjectURL(files[0])
}
</script>

<template>
  <div class="flex flex-col text-white bg-indigo-950 h-screen w-screen justify-center items-center gap-5">
    <h2 class="uppercase text-2xl">config</h2>
    <div>
      <label for="focusMusic">Focus BGM:</label>
      <input type="file" id="focusMusic" v-on:change="changeFocusAudio">
      <audio :src="bgm.focus" controls style="width: 100%;"></audio>
    </div>
    <div>
      <label for="breakMusic">Break BGM:</label>
      <input type="file" id="breakMusic" v-on:change="changeBreakAudio">
      <audio :src="bgm.break" controls style="width: 100%;"></audio>
    </div>
    <a href="#/" class="uppercase hover:text-yellow-300">
      back to home
    </a>
  </div>
</template>
