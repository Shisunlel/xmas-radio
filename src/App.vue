<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useMediaControls, useCycleList } from '@vueuse/core'
import IconPlay from './components/icons/IconPlay.vue'
import IconPlaying from './components/icons/IconPlaying.vue'
import RadioControls from './components/RadioControls.vue'
import KeyboardShortcuts from './components/KeyboardShortcuts.vue'

const songs = [
  {
    title: 'Christmas Music Magical Fairy Tale For Children Kids',
    slug: 'christmas-music-magical-fairy-tale-for-children-kids',
  },
  {
    title: 'Christmas Vacation Christmas Eve And New Year Fairy Tale',
    slug: 'christmas-vacation-christmas-eve-and-new-year-fairy-tale',
  },
  {
    title: 'Jingle Bells Rock Energetic Positive Upbeat Happy Christmas Party',
    slug: 'jingle-bells-rock-energetic-positive-upbeat-happy-christmas-party',
  },
]

const { state, next, prev } = useCycleList(songs)

const current = computed(() => {
  return `/audio/${state.value.slug}.mp3`
})

const audio = ref(null)
const { playing, currentTime, duration, volume } = useMediaControls(audio, {
  src: current,
})

function playSong(song) {
  state.value = song
  playing.value = true
}

watch(current, () => {
  playing.value = false
  nextTick(() => {
    console.log('play', current.value)
    playing.value = true
  })
})

watch(currentTime, () => {
  if (currentTime.value === duration.value) {
    next()
    playSong(state.value)
  }
})

function isSelected(song) {
  return song.slug === state.value.slug
}
function isPlaying(song) {
  return isSelected(song) && playing.value
}
</script>
<template>
  <div class="w-full h-full flex justify-center items-center p-10">
    <div>
      <div class="shadow-md relative bg-white p-5 rounded-lg border-gray-100 border-[1px]">
        <KeyboardShortcuts />
        <header class="text-center">
          <h2 class="text-green text-2xl">
            <span class="bg-gray-200 px-3.5 py-1 rounded text-sm font-bold">Advent of Vue</span>
          </h2>
          <h1 class="text-4xl mt-2 mb-5">Christmas Radio</h1>
        </header>
        <div class="flex">
          <ul>
            <li
              v-for="song in songs"
              @click="playSong(song)"
              class="text-gray-500 cursor-pointer flex items-center mb-3 hover:bg-gray-200 pr-5"
              :class="{
                'bg-gray-200': isSelected(song),
              }"
            >
              <div class="relative rounded overflow-hidden">
                <div
                  v-if="state.slug !== song.slug"
                  class="hover:opacity-0 transition-opacity absolute top-0 right-0 left-0 bottom-0 bg-gray-900 opacity-50"
                ></div>
                <div
                  class="pointer-events-none absolute text-white top-[50%] left-[50%]"
                  style="transform: translate(-50%, -50%)"
                >
                  <IconPlaying v-if="isPlaying(song)" />
                  <IconPlay v-else />
                </div>

                <img class="w-20" :src="`/img/${song.slug}.jpg`" :alt="song.title" />
              </div>
              <div class="ml-5">
                <div>{{ song.title }}</div>
              </div>
            </li>
          </ul>
        </div>
        <RadioControls
          :progress="(currentTime / duration) * 100"
          @play="playing = true"
          @stop="playing = false"
          :playing="playing"
          v-model:volume="volume"
          @foward="next"
          @back="prev"
          @rewind="currentTime = currentTime - 10"
          @fastfoward="currentTime = currentTime + 10"
        />
      </div>
      <h4 class="mt-10 text-gray-400 text-center text-sm">
        This challenge brought to you by <a href="https://vueschool.io/" class="underline">Vue School</a>
      </h4>

      <audio ref="audio" />
    </div>
  </div>
</template>

<style>
body {
  @apply bg-gray-100;
}
</style>
<style scoped>
li {
  transition: 0.3s ease background;
}
</style>
