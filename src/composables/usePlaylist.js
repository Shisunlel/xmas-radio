import { computed } from 'vue'
import { useCycleList } from '@vueuse/core'

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

export function usePlaylist() {
  return {
    songs,
    state,
    next,
    prev,
    current,
  }
}
