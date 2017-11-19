<template>
  <FileInput 
    class='react-fine-uploader-gallery-file-input-container'
    :uploader="uploader"
    :multiple="multiple"
  >
    <span class='react-fine-uploader-gallery-file-input-content'>
      <slot>
        <UploadIcon class='react-fine-uploader-gallery-file-input-upload-icon' />
        Select Files
      </slot>
    </span>
  </FileInput>
</template>


<script>
  import FileInput from '../file-input'
  import UploadIcon from './upload-icon'
  export default {
    components: {
      FileInput,
      UploadIcon
    },
    props: {
      uploader: {
        type: Object,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      }
    }
  }
</script>