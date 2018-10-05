<template>
  <renderless-delete-button
    :id="id"
    :uploader="uploader">
    <button
      v-if="!onlyRenderIfDeletable || deletable || deleting"
      slot-scope="{ deleting, deletable, buttonEvents }"
      :disabled="deleting || !deletable"
      type="button"
      v-on="buttonEvents"
    >
      Delete
    </button>
  </renderless-delete-button>
</template>

<script>
import RenderlessDeleteButton from './renderless/DeleteButton'

export default {
  components: {
    RenderlessDeleteButton,
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    onlyRenderIfDeletable: {
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
