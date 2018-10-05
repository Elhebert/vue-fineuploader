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
    statuses: null,
    initialStatus: null,
  }),

  created() {
    this.statuses = this.uploader.qq.status
    this.initialStatus = this.uploader.methods.getUploads({
      id: this.id,
    }).status

    this.deletable = this.isDeletableStatus(this.initialStatus)
    this.deleting = this.initialStatus === this.statuses.DELETING
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

      if (
        !this.isDeletableStatus(newStatus) &&
        newStatus !== this.statuses.DELETING &&
        this.deletable
      ) {
        this.deletable = false
        this.deleting = false
        this.unregisterStatusChangeHandler()

        return
      }

      if (this.isDeletableStatus(newStatus) && !this.deletable) {
        this.deletable = true
        this.deleting = false

        return
      }

      if (newStatus === this.statuses.DELETING && !this.deleting) {
        this.deleting = true

        return
      }
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
        [this.statuses.DELETE_FAILED, this.statuses.UPLOAD_SUCCESSFUL].indexOf(
          statuses,
        ) >= 0
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
