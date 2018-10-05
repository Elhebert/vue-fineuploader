<template>
  <div ref="dropzone">
    <slot ref="element"/>
  </div>
</template>

<script>
import qq from 'fine-uploader/lib/dnd'

export default {
  props: {
    multiple: {
      type: Boolean,
      default: true,
    },
    onDropError: {
      type: Function,
      default: function() {},
    },
    onProcessingDroppedFiles: {
      type: Function,
      default: function() {},
    },
    onProcessingDroppedFilesComplete: {
      type: Function,
      default: function() {},
    },
    uploader: {
      type: Object,
      required: true,
    },
    dropActiveClass: {
      type: string,
      default: ''
    }
  },

  mounted() {
    this.registerDropzone()
  },

  updated() {
    this.registerDropzone()
  },

  beforeDestroy() {
    this.qqDropzone && this.qqDropzone.dispose()
  },

  methods: {
    registerDropzone() {
      this.qqDropzone && this.qqDropzone.dispose()

      const dropzoneEl = this.$refs.element || this.$refs.dropZone

      this.qqDropzone = new qq.DragAndDrop({
        allowMultipleItems: !!this.multiple,
        callbacks: {
          dropError: (errorCode, errorData) => {
            console.error(errorCode, errorData)
            this.onDropError(errorCode, errorData)
          },
          processingDroppedFiles: this.onProcessingDroppedFiles,
          processingDroppedFilesComplete: files => {
            this.uploader.methods.addFiles(files)
            this.onProcessingDroppedFilesComplete(files)
          },
        },
        classes: {
          dropActive: this.dropActiveClass,
        },
        dropZoneElements: [dropzoneEl],
      })
    },
  },
}
</script>
