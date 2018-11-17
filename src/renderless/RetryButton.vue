<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    uploader: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    retryable: false,
    unmounted: false,
  }),

  mounted() {
    this.uploader.on('complete', this.onComplete)
    this.uploader.on('statusChange', this.onStatusChange)
  },

  beforeDestroy() {
    this.unmounted = true
    this.unregisterEventHandlers()
  },

  methods: {
    onComplete(id, name, response) {
      if (id !== this.id || this.unmounted) {
        return
      }

      if (
        !response.success &&
        !this.isRetryForbidden(response) &&
        !this.retryable
      ) {
        this.retryable = true
        return
      }

      if (response.success && this.retryable) {
        this.retryable = false
        return
      }

      if (this.isRetryForbidden(response) && this.retryable) {
        this.retryable = false
        this.unregisterEventHandlers()
      }
    },

    onStatusChange(id, oldStatus, newStatus) {
      if (
        id !== this.id ||
        this.unmounted ||
        newStatus !== this.status.RETRYING_UPLOAD
      ) {
        return
      }

      this.retryable = false
    },

    onClick() {
      if (this.retryable) {
        this.uploader.methods.retry(this.id)
      }
    },

    unregisterEventHandlers() {
      this.uploader.off('complete', this.onComplete)
      this.uploader.off('statusChange', this.onStatusChange)
    },

    isRetryForbidden(response) {
      const preventRetryResponseProperty =
        (this.uploader.options.retry &&
          this.uploader.options.retry.preventRetryResponseProperty) ||
        'preventRetry'

      return !!response[preventRetryResponseProperty]
    },
  },

  render() {
    return this.$scopedSlots.default({
      buttonEvents: {
        click: event => {
          this.onClick(event)
        },
      },
      retryable: this.retryable,
    })
  }
}
</script>
