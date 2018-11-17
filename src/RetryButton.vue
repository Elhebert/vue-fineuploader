<template>
  <renderless-retry-button
    :id="id"
    :uploader="uploader"
  >
    <button
      v-if="!onlyRenderIfRetryable || retryable"
      slot-scope="{ retryable, buttonEvents }"
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
  components: {
    RenderlessRetryButton,
  },
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
}
</script>
