<template>
  <component
    :is="progressBar"
    :id="id"
    :uploader="uploader"
  >
    <div
      :hidden="!uploading && hidesWhenNotUploading"
      slot-scope="{ uploading, progress }"
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

  components: {
    RenderlessFileProgressBar,
    RenderlessTotalProgressBar
  },

  computed: {
    progressBar() {
      return this.id === null ? 'renderless-total-progress-bar' : 'renderless-file-progress-bar'
    },
  },
}
</script>
