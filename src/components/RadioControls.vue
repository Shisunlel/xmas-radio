<script setup>
import { computed } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import IconBackward from './icons/IconBackward.vue'
import IconForward from './icons/IconForward.vue'
import IconPlay from './icons/IconPlay.vue'
import IconPause from './icons/IconPause.vue'
import IconChevronRight from './icons/IconChevronRight.vue'
import IconChevronLeft from './icons/IconChevronLeft.vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  playing: {
    type: Boolean,
    default: false,
  },
  volume: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['play', 'stop', 'foward', 'back', 'rewind', 'fastfoward', 'update:volume'])

onKeyStroke(' ', e => {
  const activeEl = document.activeElement
  if (activeEl.tagName.toUpperCase() === 'BUTTON') return
  e.preventDefault()
  props.playing ? emit('stop') : emit('play')
})

onKeyStroke('ArrowRight', e => {
  e.preventDefault()
  if (e.metaKey) {
    emit('foward')
  } else {
    emit('fastfoward')
  }
})
onKeyStroke('ArrowLeft', e => {
  e.preventDefault()
  if (e.metaKey) {
    emit('back')
  } else {
    emit('rewind')
  }
})

onKeyStroke('ArrowUp', e => {
  e.preventDefault()
  emit('update:volume', props.volume + 0.1)
})

onKeyStroke('ArrowDown', e => {
  e.preventDefault()
  emit('update:volume', props.volume - 0.1)
})

const volumneGradient = computed(() => {
  return `linear-gradient(90deg, rgba(66, 184, 131, 1) 0%, rgba(66, 184, 131, 1) ${props.volume * 100}%, transparent ${
    props.volume * 100
  }%)`
  return 'green'
})
</script>
<template>
  <div class="w-full relative rounded bg-gray-800 text-white">
    <div class="progress rounded h-1 bg-gray-400 relative" :style="`width: ${progress}%;`"></div>
    <div class="flex sm:justify-center items-center">
      <button class="pl-5" @click="emit('back')" title="Previous Song">
        <IconChevronLeft />
      </button>

      <button @click="emit('rewind')" title="Rewind">
        <IconBackward />
      </button>

      <button
        @click="playing ? $emit('stop') : $emit('play')"
        class="bg-green rounded-full w-12 h-12 scale-150 mx-5"
        :title="playing ? 'Pause' : 'Play'"
      >
        <Transition>
          <IconPause class="absolute top-[50%] left-[50%]" style="transform: translate(-50%, -50%)" v-if="playing" />
          <IconPlay class="absolute top-[50%] left-[50%]" style="transform: translate(-50%, -50%)" v-else />
        </Transition>
      </button>

      <button @click="emit('fastfoward')" title="Fast Forward">
        <IconForward />
      </button>
      <button @click="emit('foward')" title="Next Song">
        <IconChevronRight />
      </button>
    </div>
    <input
      :value="volume * 100"
      @input="emit('update:volume', $event.target.value / 100)"
      class="absolute right-5 w-24 top-[50%]"
      style="transform: translateY(-50%)"
      type="range"
    />
  </div>
</template>
<style scoped>
.progress {
  background: linear-gradient(90deg, rgba(66, 184, 131, 1) 0%, rgba(0, 48, 255, 1) 100%);
}
input[type='range'] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  border: rgba(66, 184, 131, 1) 1px solid;
  background: v-bind(volumneGradient);
  height: 4px;
  border-radius: 3px;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  background: white;
  border-radius: 10px;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.4s ease;
  transform: translate(-50%, -50%) scale(1) !important;
}

.v-enter-from,
.v-leave-to {
  transform: translate(-50%, -50%) scale(0.3) !important;
  opacity: 0;
}
div svg {
  transition: 0.3s ease all;
}
div svg:hover {
  opacity: 0.7;
}
</style>
