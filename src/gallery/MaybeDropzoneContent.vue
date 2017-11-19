<template>
  <span :class="className" v-if="disabled && !content">
    Upload files
  </span>
  <span :class="className" v-else-if="content">
    {{ content }}
  </span>
  <span :class="className" v-else-if="!disabled">
    <UploadIcon class='react-fine-uploader-gallery-dropzone-upload-icon' />
    Drop files here
  </span>
</template>

<script>
  import UploadIcon from './upload-icon'

  export default {
    components: {
      UploadIcon
    },
    props: {
      content: {
        type: String
      },
      disabled: {
        type: Boolean
      }
    },
    computed: {
      className () {
        return this.disabled
          ? 'react-fine-uploader-gallery-nodrop-content'
          : 'react-fine-uploader-gallery-dropzone-content'
      }
    }
  }
</script>