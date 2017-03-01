<template>
  <div class="fine-uploader-dropzone-container" ref="dropZone">
      <slot ref="element"></slot>
  </div>
</template>

<style lang="css"></style>

<script>
  import qq from 'fine-uploader/lib/dnd'

  export default {
    props: {
      dropActiveClassName: {
        type: String,
        default: 'vue-fine-uploader-dropzone-active'
      },
      multiple: {
        type: Boolean
      },
      onDropError: {
        type: Function
      },
      onProcessingDroppedFiles: {
        type: Function
      },
      onProcessingDroppedFilesComplete: {
        type: Function
      },
      uploader: {
        type: Object, required: true
      }
    },

    mounted () {
      this._registerDropzone()
    },

    updated () {
      this._registerDropzone()
    },

    beforeDestroy () {
      this._qqDropzone && this._qqDropzone.dispose()
    },

    methods: {
      _onDropError (errorCode, errorData) {
        console.error(errorCode, errorData)

        this.onDropError && this.onDropError(errorCode, errorData)
      },

      _onProcessingDroppedFilesComplete (files) {
        this.uploader.methods.addFiles(files)

        this.onProcessingDroppedFilesComplete && this.onProcessingDroppedFilesComplete(files)
      },

      _registerDropzone () {
        this._qqDropzone && this._qqDropzone.dispose()

        const dropzoneEl = this.$refs.element || this.$refs.dropZone

        this._qqDropzone = new qq.DragAndDrop({
          allowMultipleItems: !!this.multiple,
          callbacks: {
            dropError: this._onDropError.bind(this),
            processingDroppedFiles: this.onProcessingDroppedFiles || function () {},
            processingDroppedFilesComplete: this._onProcessingDroppedFilesComplete.bind(this)
          },
          classes: {
            dropActive: this.dropActiveClassName || ''
          },
          dropZoneElements: [dropzoneEl]
        })
      }
    }
  }
</script>
