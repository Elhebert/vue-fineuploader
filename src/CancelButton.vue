<template>
  <renderless-cancel-button
    :id="id"
    :uploader="uploader"
  >
    <button
      v-if="!onlyRenderIfCancelable || cancelable"
      slot-scope="{ buttonEvents, cancelable }"
      :disabled="!cancelable"
      type="button"
      v-on="buttonEvents"
    >
      Cancel
    </button>
  </renderless-cancel-button>
</template>

<script>
import RenderlessCancelButton from './renderless/CancelButton'

export default {
  components: {
    RenderlessCancelButton,
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    onlyRenderIfCancelable: {
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
