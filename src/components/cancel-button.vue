<template>
  <button aria-label="cancel"
    class="vue-fine-uploader-cancel-button" }
    :disabled="!this.state.cancelable"
    :onClick="this.state.cancelable && this._onClick">
      <slot>Cancel</slot>
  </button>
</template>

<style lang="css"></style>

<script>
  const isCancelable = status => {
    return [
      'delete failed',
      'paused',
      'queued',
      'retrying upload',
      'submitted',
      'uploading',
      'upload failed'
    ].indexOf(status) >= 0
  }

  export default {

    props: {
      id: {
        type: Number,
        required: true
      },
      onlyRenderIfCancelable: {
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
          cancelable: true
        }
      }
    },

    mounted () {
      this.uploader.on('statusChange', this._onStatusChange)
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterStatusChangeHandler()
    },

    methods: {
      _onStatusChange: (id, oldStatus, newStatus) => {
        if (id === this.id && !this._unmounted) {
          if (!isCancelable(newStatus) && this.state.cancelable) {
            this.$set(this.state, 'cancelable', false)
          } else if (isCancelable(newStatus) && !this.state.cancelable) {
            this.$set(this.state, 'cancelable', true)
          } else if (newStatus === 'deleted' || newStatus === 'canceled') {
            this._unregisterStatusChangeHandler()
          }
        }
      },

      _onClick: () => this.uploader.methods.cancel(this.id),

      _unregisterStatusChangeHandler: () => {
        this.uploader.off('statusChange', this._onStatusChange)
      }
    }
  }
</script>
