<script>
const DEFAULT_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte']

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
    size: 0,
    onUpload: null,
  }),

  computed: {
    formatted() {
      let formatSizeAndUnits = {}

      Object.values(DEFAULT_UNITS).some(unit => {
        if (this.size >= 1e3) {
          this.size = (this.size / 1e3).toFixed(2)

          return false
        }

        formatSizeAndUnits = { size: this.size, unit }
        return true
      })

      return formatSizeAndUnits
    },
  },

  methods: {
    isCurrentFile(id) {
      return this.id === id
    },
  },

  created() {
    this.size = this.uploader.methods.getSize(this.id)

    const scalingOption = this.uploader.options.scaling

    if (scalingOption && scalingOption.sizes.length) {
      this.onUpload = id => {
        if (!this.isCurrentFile(id)) {
          return
        }

        this.size = this.uploader.methods.getSize(id)
      }
    }
  },

  mounted() {
    this.onUpload && this.uploader.on('upload', this.onUpload)
  },

  beforeDestroy() {
    this.onUpload && this.uploader.off('upload', this.onUpload)
  },

  render() {
    return this.$scopedSlots.default({
      size: this.formatted.size,
      unit: this.formatted.unit,
    })
  },
}
</script>
