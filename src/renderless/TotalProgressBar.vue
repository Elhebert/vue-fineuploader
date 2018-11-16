<script>
export default {
  props: {
    uploader: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    bytesUploaded: null,
    totalSize: null,
    uploading: false,
    unmounted: false,
  }),

  mounted() {
    this.uploader.on('progress', this.onProgress)
    this.uploader.on('statusChange', this.onStatusChange)
  },

  beforeDestroy() {
    this.unmounted = true
    this.unregisterEventHandlers()
  },

  methods: {
    onStatusChange(id, oldStatus, newStatus) {
      if (this.unmounted) {
        return
      }

      if (this.hasUploadEnded(newStatus) && !this.uploader.methods.getInProgress()) {
        this.uploading = false

        return
      }

      if (this.uploader.methods.getInProgress()) {
        this.uploading = true
      }
    },

    onProgress(bytesUploaded, totalSize) {
      this.bytesUploaded = bytesUploaded
      this.totalSize = totalSize
    },

    unregisterEventHandlers() {
      this.uploader.off('progress', this.onProgress)
      this.uploader.off('statusChange', this.onStatusChange)
    },

    hasUploadEnded(status) {
      return (
        status === this.uploader.qq.status.UPLOAD_FAILED ||
        status === this.uploader.qq.status.UPLOAD_SUCCESSFUL ||
        status === this.uploader.qq.status.CANCELED
      )
    },
  },

  render() {
    return this.$scopedSlots.default({
      progress: (this.bytesUploaded / this.totalSize) * 100 || 0,
      uploading: this.uploading,
    })
  },
}
</script>
