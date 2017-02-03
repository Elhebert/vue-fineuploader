<template>
  <div :class="containerClassName"
       :hidden="state.hidden">
      <div aria-valuemax='100'
            aria-valuemin='0'
            :aria-valuenow="percentWidth"
            :class="className"
            role='progressbar'
            :style="{ 'width': percentWidth + '%' }" />
  </div>
</template>

<style lang="css"></style>

<script>
  const isUploadComplete = status =>
    status === 'upload failed' || status === 'upload successful' || status === 'canceled'

  export default {
    props: {
      id: {
        type: Number
      },
      hideBeforeStart: {
        type: Boolean,
        default: true
      },
      hideOnComplete: {
        type: Boolean,
        default: true
      },
      uploader: {
        type: Object,
        rquired: true
      }
    },

    data () {
      return {
        state: {
          bytesUploaded: null,
          hidden: this.hideBeforeStart,
          totalSize: null
        },
        _unmounted: false
      }
    },

    created () {
      this._createEventHandlers()
    },

    mounted () {
      if (this._isTotalProgress) {
        this.uploader.on('totalProgress', this._trackProgressEventHandler)
      } else {
        this.uploader.on('progress', this._trackProgressEventHandler)
      }

      this.uploader.on('statusChange', this._trackStatusEventHandler)
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterEventHandlers()
    },

    methods: {
      _createEventHandlers () {
        if (this._isTotalProgress) {
          this._trackProgressEventHandler = (bytesUploaded, totalSize) => {
            this.setState({ bytesUploaded, totalSize })
          }
        } else {
          this._trackProgressEventHandler = (id, name, bytesUploaded, totalSize) => {
            if (id === this.id) {
              this.$set(this.state, 'bytesUploaded', totalSize)
            }
          }
        }

        this._trackStatusEventHandler = (id, oldStatus, newStatus) => {
          if (!this._unmounted) {
            if (this._isTotalProgress) {
              if (
                !this.state.hidden &&
                this.hideOnComplete &&
                isUploadComplete(newStatus) &&
                !this.uploader.methods.getInProgress()
              ) {
                this.$set(this.state, 'hidden', true)
              } else if (this.state.hidden && this.uploader.methods.getInProgress()) {
                this.$set(this.state, 'hidden', false)
              }
            } else if (id === this.id) {
              if (this.state.hidden && newStatus === 'uploading') {
                this.$set(this.state, 'hidden', false)
              } else if (!this.state.hidden && this.hideOnComplete && isUploadComplete(newStatus)) {
                this.$set(this.state, 'hidden', true)
              }
            }
          }
        }
      },

      _unregisterEventHandlers () {
        if (this._isTotalProgress) {
          this.uploader.off('totalProgress', this._trackProgressEventHandler)
        } else {
          this.uploader.off('progress', this._trackProgressEventHandler)
        }

        this.uploader.off('statusChange', this._trackStatusEventHandler)
      }
    },

    computed: {
      _isTotalProgress () {
        return !!this.id
      },

      className () {
        return this._isTotalProgress ? 'vue-fine-uploader-total-progress-bar' : 'vue-fine-uploader-file-progress-bar'
      },

      containerClassName () {
        return `${this.className}-container`
      },

      percentWidth () {
        return this.state.bytesUploaded / this.state.totalSize * 100 || 0
      }
    }
  }
</script>
