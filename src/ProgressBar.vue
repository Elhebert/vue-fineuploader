<template>
  <component
    :is="progressBar"
    :id="id"
    :uploader="uploader"
  >
    <div
      slot-scope="{ uploading, progress }"
      :hidden="!uploading && hidesWhenNotUploading"
      :aria-valuenow="progress"
      :style="{ 'width': `${progress}%` }"
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar" />
  </component>
</template>

<script>
import RenderlessFileProgressBar from './renderless/FileProgressBar'
import RenderlessTotalProgressBar from './renderless/TotalProgressBar'

export default {
  components: {
    RenderlessFileProgressBar,
    RenderlessTotalProgressBar,
  },
  props: {
    id: {
      type: Number,
      default: null,
    },
    hidesWhenNotUploading: {
      type: Boolean,
      default: true,
    },
    uploader: {
      type: Object,
      required: true,
    },
  },

  computed: {
    progressBar() {
      return this.id === null
        ? 'renderless-total-progress-bar'
        : 'renderless-file-progress-bar'
    },
  },
}
</script>
