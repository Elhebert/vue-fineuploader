<template>
  <button v-if="onlyRenderIfRetryable && state.retryable"
          aria-label="retry"
          class="vue-fine-uploader-retry-button"
          :disabled="!state.retryable"
          @click="_onClick">
    <slot>Retry</slot>
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
      onlyRenderIfRetryable: {
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
          retryable: false
        },
        _unmounted: false
      }
    },

    mounted () {
      this.uploader.on('complete', this._onComplete)
      this.uploader.on('statusChange', this._onStatusChange)
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterEventHandlers()
    },

    methods: {
      _onComplete (id, name, response) {
        if (id === this.id && !this._unmounted) {
          const retryForbidden = this.isRetryForbidden(response, this.uploader)

          if (!response.success && !retryForbidden && !this.state.retryable) {
            this.$set(this.state, 'retryable', true)
          } else if (response.success && this.state.retryable) {
            this.$set(this.state, 'retryable', false)
          } else if (retryForbidden && this.state.retryable) {
            this.$set(this.state, 'retryable', false)
            this._unregisterEventHandlers()
          }
        }
      },

      _onStatusChange (id, oldStatus, newStatus) {
        if (id === this.id && !this._unmounted && newStatus === 'retrying upload') {
          this.$set(this.state, 'retryable', false)
        }
      },

      _onClick () {
        if (this.state.retryable) {
          this.uploader.methods.retry(this.id)
        }
      },

      _unregisterEventHandlers () {
        this.uploader.off('complete', this._onComplete)
        this.uploader.off('statusChange', this._onStatusChange)
      },

      isRetryForbidden (response, uploader) {
        const preventRetryResponseProperty =
              (uploader.options.retry && uploader.options.retry.preventRetryResponseProperty) ||
              'preventRetry'

        return !!response[preventRetryResponseProperty]
      }
    }
  }
</script>
