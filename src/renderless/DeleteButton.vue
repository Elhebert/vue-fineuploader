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
    deletable: false,
    deleting: false,
    unmounted: false,
  }),

  created() {
    this.uploader.qq.status = this.uploader.qq.status
    const initialStatus = this.uploader.methods.getUploads({
      id: this.id,
    }).status

    this.deletable = this.isDeletableStatus(initialStatus)
    this.deleting = initialStatus === this.uploader.qq.status.DELETING
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
      if (!this.isCurrentFile(id) || this.unmounted) {
        return
      }

      if (
        !this.isDeletableStatus(newStatus) &&
        newStatus !== this.uploader.qq.status.DELETING
      ) {
        this.deletable = false
        this.deleting = false
        this.unregisterStatusChangeHandler()

        return
      }

      if (this.isDeletableStatus(newStatus)) {
        this.deletable = true
        this.deleting = false

        return
      }

      if (newStatus === this.uploader.qq.status.DELETING) {
        this.deleting = true
      }
    },

    isCurrentFile(id) {
      return this.id === id
    },

    onClick(event) {
      event.preventDefault()

      if (this.deletable && !this.deleting) {
        this.uploader.methods.deleteFile(this.id)
      }
    },

    unregisterStatusChangeHandler() {
      this.uploader.off('statusChange', this.onStatusChange)
    },

    isDeletableStatus(statuses) {
      return (
        [
          this.uploader.qq.status.DELETE_FAILED,
          this.uploader.qq.status.UPLOAD_SUCCESSFUL,
        ].indexOf(statuses) >= 0
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
      deletable: this.deletable,
      deleting: this.deleting,
    })
  },
}
</script>
