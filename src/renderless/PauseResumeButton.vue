<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    allowPauseOnlyAfterFirstChunk: {
      type: Boolean,
      default: true,
    },
    uploader: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    atLeastOneChunkUploaded: false,
    pausable: false,
    resumable: false,
    unmounted: false,
    statuses: null,
    initialStatus: null,
  }),

  computed: {
    buttonClassName() {
      return this.resumable
        ? 'fine-uploader-resume-button'
        : 'fine-uploader-pause-button'
    },

    buttonLabel() {
      return this.resumable ? 'resume' : 'pause'
    },
  },

  created() {
    this.statuses = this.uploader.qq.status
    this.initialStatus = this.uploader.methods.getUploads({
      id: this.id,
    }).status
    this.pausable = this.initialStatus === this.statuses.UPLOADING
    this.resumable = this.initialStatus === this.statuses.PAUSED
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
      return status === this.statuses.UPLOADING
    },

    isResumable(status) {
      return status === this.statuses.PAUSED
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
        newStatus === this.statuses.DELETED ||
        newStatus === this.statuses.CANCELED ||
        newStatus === this.statuses.UPLOAD_SUCCESSFUL
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
        id === this.id &&
        this.allowPauseOnlyAfterFirstChunk &&
        !this.unmounted
      ) {
        if (chunkData.partIndex > 0 && !this.pausable) {
          this.pausable = true
          this.resumable = false
        } else if (chunkData.partIndex === 0 && this.pausable) {
          this.pausable = false
          this.resumable = false
        }
      }
    },

    onResume(id) {
      if (id === this.id && !this.unmounted && !this.atLeastOneChunkUploaded) {
        this.atLeastOneChunkUploaded = true
        this.pausable = true
        this.resumable = false
      }
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
