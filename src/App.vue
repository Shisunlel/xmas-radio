<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useMediaControls, useCycleList } from '@vueuse/core'
import RadioSong from './components/RadioSong.vue'
import RadioControls from './components/RadioControls.vue'
import RadioHeader from './components/RadioHeader.vue'
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

function playSong(song = null) {
  if (song) state.value = song
  playing.value = false
  nextTick(() => {
    playing.value = true
  })
}

watch(current, () => playSong())

watch(currentTime, () => {
  if (currentTime.value === duration.value) next()
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
        <RadioHeader />
        <ul>
          <RadioSong
            v-for="song in songs"
            :key="song.slug"
            :song="song"
            :isSelected="isSelected(song)"
            :isPlaying="isPlaying(song)"
            @click="playSong(song)"
          />
        </ul>
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
