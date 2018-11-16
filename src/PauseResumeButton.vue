<template>
  <renderless-pause-resume-button
    v-bind="{id, uploader, allowPauseOnlyAfterFirstChunk}"
  >
    <button
      v-if="pausable || resumable || !onlyRenderIfEnabled"
      slot-scope="{ pausable, resumable, buttonEvents }"
      :disabled="!pausable && !resumable"
      v-on="buttonEvents"
    >
      <template v-if="resumable">Resume</template>
      <template v-else>Pause</template>
    </button>
  </renderless-pause-resume-button>
</template>

<script>
import RenderlessPauseResumeButton from './renderless/PauseResumeButton'

export default {
  components: {
    RenderlessPauseResumeButton,
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    onlyRenderIfEnabled: {
      type: Boolean,
      default: true,
    },
    allowPauseOnlyAfterFirstChunk: {
      type: Boolean,
      default: true,
    },
    uploader: {
      type: Object,
      required: true,
    },
  },
}
</script>
