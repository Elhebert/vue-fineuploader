<template>
  <button v-if="state.pausable || state.resumable || !onlyRenderIfEnabled"
          :aria-label="buttonLabel"
          class="vue-fine-uploader-pause-resume-button"
          :class="buttonClassName"
          :disabled="!state.pausable && !state.resumable"
          @click="_onClick">
      <slot v-if="state.resumable" name="resume">Resume</slot>
      <slot v-else name="state.pause">Pause</slot>
  </button>
</template>

<style lang="css"></style>

<script>
  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      onlyRenderIfEnabled: {
        type: Boolean,
        default: true
      },
      allowPauseOnlyAfterFirstChunk: {
        type: Boolean,
        default: true
      },
      uploader: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        state: {
          pausable: false,
          resumable: false
        },
        _unmounted: false
      }
    },

    mounted () {
      this.uploader.on('statusChange', this._onStatusChange)
      this.uploader.on('uploadChunk', this._onUploadChunk)
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterOnStatusChangeHandler()
      this._unregisterOnUploadChunkHandler()
    },

    computed: {
      buttonClassName () {
        return this.resumable ? 'vue-fine-uploader-resume-button' : 'vue-fine-uploader-pause-button'
      },

      buttonLabel () {
        return this.resumable ? 'resume' : 'pause'
      }
    },

    methods: {
      isPausable (status) {
        return status === 'uploading'
      },

      isResumable (status) {
        return status === 'paused'
      },

      _onStatusChange (id, oldStatus, newStatus) {
        if (id === this.id && !this._unmounted) {
          const pausable = this.isPausable(newStatus)
          const resumable = !pausable && this.isResumable(newStatus)

          this.$set(this.state, 'pausable', pausable)
          this.$set(this.state, 'resumable', resumable)

          if (newStatus === 'deleted' || newStatus === 'canceled' || newStatus === 'upload successful') {
            this._unregisterStatusChangeHandler()
            this._unregisterOnUploadChunkHandler()
          }
        }
      },

      _onClick () {
        if (this.state.pausable) {
          this.uploader.methods.pauseUpload(this.id)
        } else if (this.state.resumable) {
          this.uploader.methods.continueUpload(this.id)
        }
      },

      _onUploadChunk (id, name, chunkData) {
        if (id === this.id && this.allowPauseOnlyAfterFirstChunk === true && !this._unmounted) {
          if (chunkData.partIndex > 0 && !this.state.pausable) {
            this.$set(this.state, 'pausable', true)
            this.$set(this.state, 'resumable', false)
          } else if (chunkData.partIndex === 0 && this.state.pausable) {
            this.$set(this.state, 'pausable', false)
            this.$set(this.state, 'resumable', false)
          }
        }
      },

      _unregisterOnStatusChangeHandler () {
        this.uploader.off('statusChange', this._onStatusChange)
      },

      _unregisterOnUploadChunkHandler () {
        this.uploader.off('uploadChunk', this._onUploadChunk)
      },

      _unregisterStatusChangeHandler () {
        this.uploader.off('statusChange', this._onStatusChange)
      }
    }
  }
</script>
