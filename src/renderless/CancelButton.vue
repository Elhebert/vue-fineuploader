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
    cancelable: true,
    unmounted: false,
    statuses: null,
    initialStatus: null,
  }),

  created() {
    this.statuses = this.uploader.qq.status
    this.initialStatus = this.uploader.methods.getUploads({
      id: this.id,
    }).status
    this.cancelable = this.isCancelableStatus(this.initialStatus)
  },

  mounted() {
    this.uploader.on('statusChange', this.onStatusChange)
  },

  beforeDestroy() {
    this.unmounted = true
    this.unregisterStatusChangeHandler()
  },

  methods: {
    onStatusChange(id, oldStatus, newStatus) {
      if (id !== this.id || this.unmounted) {
        return
      }

      if (this.isCancelableStatus(newStatus) === !this.cancelable) {
        this.cancelable = this.isCancelableStatus(newStatus)

        return
      }

      if (
        newStatus === this.statuses.DELETED ||
        newStatus === this.statuses.CANCELED
      ) {
        this.unregisterStatusChangeHandler()
      }
    },

    onClick(event) {
      event.preventDefault()

      if (this.cancelable) {
        this.uploader.methods.cancel(this.id)
      }
    },

    unregisterStatusChangeHandler() {
      this.uploader.off('statusChange', this.onStatusChange)
    },

    isCancelableStatus(status) {
      return (
        [
          this.statuses.DELETE_FAILED,
          this.statuses.PAUSED,
          this.statuses.QUEUED,
          this.statuses.RETRYING_UPLOAD,
          this.statuses.SUBMITTED,
          this.statuses.UPLOADING,
          this.statuses.UPLOAD_FAILED,
        ].indexOf(status) >= 0
      )
    },
  },

  render() {
    return this.$scopedSlots.default({
      buttonEvents: {
        click: event => {
          this.onClick(event)
        },
      },
      cancelable: this.cancelable,
    })
  },
}
</script>
