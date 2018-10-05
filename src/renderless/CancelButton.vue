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
    cancelable: false,
    unmounting: false,
  }),

  created() {
    const initialStatus = this.uploader.methods.getUploads({
      id: this.id,
    }).status
    this.cancelable = this.isCancelableStatus(initialStatus)
  },

  mounted() {
    this.uploader.on('statusChange', this.onStatusChange)
  },

  beforeDestroy() {
    this.unmounting = true
    this.unregisterStatusChangeHandler()
  },

  methods: {
    onStatusChange(id, oldStatus, newStatus) {
      if (!this.isCurrentFile(id) || this.unmounting) {
        return
      }

      if (
        newStatus === this.uploader.qq.status.DELETED ||
        newStatus === this.uploader.qq.status.CANCELED
      ) {
        this.unregisterStatusChangeHandler()
      }

      this.cancelable = this.isCancelableStatus(newStatus)
    },

    isCurrentFile(id) {
      return this.id === id
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
          this.uploader.qq.status.DELETE_FAILED,
          this.uploader.qq.status.PAUSED,
          this.uploader.qq.status.QUEUED,
          this.uploader.qq.status.RETRYING_UPLOAD,
          this.uploader.qq.status.SUBMITTED,
          this.uploader.qq.status.UPLOADING,
          this.uploader.qq.status.UPLOAD_FAILED,
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
