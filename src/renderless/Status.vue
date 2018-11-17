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
    status: null,
    unmounted: false,
  }),

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

      this.status = newStatus
    },

    unregisterStatusChangeHandler() {
      this.uploader.off('statusChange', this.onStatusChange)
    },
  },

  render() {
    return this.$scopedSlots.default({
      status: this.status,
    })
  },
}
</script>
