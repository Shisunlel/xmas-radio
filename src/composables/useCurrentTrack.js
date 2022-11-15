import { usePlaylist } from './usePlaylist'
import { useMediaControls } from '@vueuse/core'
import { nextTick, computed, ref } from 'vue'

const el = ref(document.createElement('AUDIO'))

const { current: currentTrack, state } = usePlaylist()
const { playing, currentTime, duration, volume } = useMediaControls(el, {
  src: currentTrack,
})

export function useCurrentTrack() {
  const progress = computed(() => (currentTime.value / duration.value) * 100)

  function play(song = null) {
    if (song) state.value = song
    playing.value = false
    nextTick(() => {
      playing.value = true
    })
  }

  function pause() {
    playing.value = false
  }

  function ff() {
    currentTime.value = currentTime.value + 10
  }

  function rewind() {
    currentTime.value = currentTime.value - 10
  }

  return {
    pause,
    play,
    ff,
    rewind,
    progress,
    currentTrack,
    playing,
    currentTime,
    duration,
    volume,
  }
}
