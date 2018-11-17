<template>
  <renderless-retry-button
    :id="id"
    :uploader="uploader"
  >
    <button
      slot-scope="{ retryable, buttonEvents }"
      v-if="!onlyRenderIfRetryable || retryable"
      :disabled="!retryable"
      aria-label="retry"
      v-on="buttonEvents"
    >
      Retry
    </button>
  </renderless-retry-button>
</template>

<script>
import RenderlessRetryButton from './renderless/RetryButton'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    onlyRenderIfRetryable: {
      type: Boolean,
      default: true,
    },
    uploader: {
      type: Object,
      required: true,
    },
  },

  components: {
    RenderlessRetryButton
  }
}
</script>
