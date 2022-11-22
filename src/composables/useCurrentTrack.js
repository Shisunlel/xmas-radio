import { usePlaylist } from '@/composables/usePlaylist'
import { useMediaControls } from '@vueuse/core'
import { nextTick, computed, ref } from 'vue'

const el = ref(document.createElement('AUDIO'))

const { current: currentTrack, state } = usePlaylist()
const { playing, currentTime, duration, volume } = useMediaControls(el, {
  src: currentTrack,
})

function prettifyTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time - minutes * 60)

  const half = `${minutes.toString().length === 1 ? '0' + minutes : minutes}`
  return `${half}:${seconds.toString().length === 1 ? '0' + seconds : seconds}`
}

export function useCurrentTrack() {
  function play(song = null) {
    if (song) state.value = song
    playing.value = false
    nextTick(() => {
      playing.value = true
    })
  }

  const progress = computed(() => (currentTime.value / duration.value) * 100)
  const durationPretty = computed(() => {
    return prettifyTime(duration.value)
  })
  const currentTimePretty = computed(() => {
    return prettifyTime(currentTime.value)
  })

  const timeDisplay = computed(() => {
    return `${currentTimePretty.value} - ${durationPretty.value}`
  })

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
    timeDisplay,
    progress,
    currentTrack,
    playing,
    currentTime,
    duration,
    volume,
  }
}
