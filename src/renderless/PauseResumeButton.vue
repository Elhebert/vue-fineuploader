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
    allowPauseOnlyAfterFirstChunk: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    atLeastOneChunkUploaded: false,
    pausable: false,
    resumable: false,
    unmounted: false,
    initialStatus: null,
  }),

  created() {
    this.initialStatus = this.uploader.methods.getUploads({
      id: this.id,
    }).status
    this.pausable = this.initialStatus === this.uploader.qq.status.UPLOADING
    this.resumable = this.initialStatus === this.uploader.qq.status.PAUSED
  },

  mounted() {
    this.uploader.on('resume', this.onResume)
    this.uploader.on('statusChange', this.onStatusChange)
    this.uploader.on('uploadChunk', this.onUploadChunk)
  },

  beforeDestroy() {
    this.unmounted = true
    this.unregisterOnResumeHandler()
    this.unregisterOnUploadChunkHandler()
    this.unregisterOnStatusChangeHandler()
  },

  methods: {
    isPausable(status) {
      return status === this.uploader.qq.status.UPLOADING
    },

    isResumable(status) {
      return status === this.uploader.qq.status.PAUSED
    },

    onStatusChange(id, oldStatus, newStatus) {
      if (id !== this.id || this.unmounted) {
        return
      }
      const pausable = this.isPausable(newStatus)
      const resumable = !pausable && this.isResumable(newStatus)

      this.pausable = pausable
      this.resumable = resumable

      if (
        newStatus === this.uploader.qq.status.DELETED ||
        newStatus === this.uploader.qq.status.CANCELED ||
        newStatus === this.uploader.qq.status.UPLOAD_SUCCESSFUL
      ) {
        this.unregisterOnResumeHandler()
        this.unregisterOnUploadChunkHandler()
        this.unregisterOnStatusChangeHandler()
      }
    },

    onClick(event) {
      event.preventDefault()

      if (this.pausable) {
        this.uploader.methods.pauseUpload(this.id)
      } else if (this.resumable) {
        this.uploader.methods.continueUpload(this.id)
      }
    },

    onUploadChunk(id, name, chunkData) {
      if (
        id !== this.id ||
        !this.allowPauseOnlyAfterFirstChunk ||
        this.unmounted
      ) {
        return
      }

      if (chunkData.partIndex > 0 && !this.pausable) {
        this.pausable = true
        this.resumable = false
      } else if (chunkData.partIndex === 0 && this.pausable) {
        this.pausable = false
        this.resumable = false
      }
    },

    onResume(id) {
      if (id !== this.id || this.atLeastOneChunkUploaded || this.unmounted) {
        return
      }

      this.atLeastOneChunkUploaded = true
      this.pausable = true
      this.resumable = false
    },

    unregisterOnResumeHandler() {
      this.uploader.off('resume', this.onResume)
    },

    unregisterOnStatusChangeHandler() {
      this.uploader.off('statusChange', this.onStatusChange)
    },

    unregisterOnUploadChunkHandler() {
      this.uploader.off('uploadChunk', this.onUploadChunk)
    },
  },

  render() {
    return this.$scopedSlots.default({
      pausable: this.pausable,
      resumable: this.resumable,
      buttonEvents: {
        click: event => {
          this.onClick(event)
        },
      },
    })
  },
}
</script>
