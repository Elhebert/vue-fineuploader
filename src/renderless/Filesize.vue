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
      let size = this.size

      Object.values(DEFAULT_UNITS).some(unit => {
        if (size >= 1e3) {
          size = (size / 1e3).toFixed(2)

          return false
        }

        formatSizeAndUnits = { size, unit }
        return true
      })

      return formatSizeAndUnits
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

  methods: {
    isCurrentFile(id) {
      return this.id === id
    },
  },

  render() {
    return this.$scopedSlots.default({
      size: this.formatted.size,
      unit: this.formatted.unit,
    })
  },
}
</script>
