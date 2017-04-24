<template>
<!-- Because of inline elements and whitespace, we remove the whitespace using
comments so that we don't interrupt text flow where this component is used -->
<!----><span v-if="!(state.size == null || state.size < 0)" class="vue-fine-uploader-filesize"><!--
      --><span class="vue-fine-uploader-filesize-value"><!--
        -->{{ formatted.size }}
         </span><!--
      --><span class="vue-fine-uploader-filesize-separator"> </span><!--
      --><span class="vue-fine-uploader-filesize-unit"><!--
        -->{{ formatted.units }}<!--
      --></span><!--
    --></span>
</template>

<style lang="css"></style>

<script>
  import isPlainObject from 'lodash.isplainobject'

  const formatSizeAndUnits = ({ size, units }) => {
    let formattedSize
    let formattedUnits

    if (size < 1e+3) {
      formattedSize = size
      formattedUnits = units.byte
    } else if (size >= 1e+3 && size < 1e+6) {
      formattedSize = (size / 1e+3).toFixed(2)
      formattedUnits = units.kilobyte
    } else if (size >= 1e+6 && size < 1e+9) {
      formattedSize = (size / 1e+6).toFixed(2)
      formattedUnits = units.megabyte
    } else if (size >= 1e+9 && size < 1e+12) {
      formattedSize = (size / 1e+9).toFixed(2)
      formattedUnits = units.gigabyte
    } else {
      formattedSize = (size / 1e+12).toFixed(2)
      formattedUnits = units.terabyte
    }

    return { size: formattedSize, units: formattedUnits }
  }

  const areUnitsEqual = (units1, units2) => {
    const keys1 = Object.keys(units1)

    if (keys1.length === Object.keys(units2).length) {
      return keys1.every(key1 => units1[key1] === units2[key1])
    }

    return false
  }

  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      units: {
        type: Object,
        validator: (value) => {
          const obj = {
            byte: 'string',
            kilobyte: 'string',
            megabyte: 'string',
            gigabyte: 'string',
            terabyte: 'string'
          }

          if (!isPlainObject(value)) {
            return false
          }

          const keys = Object.keys(obj)
          const valueKeys = Object.keys(value)

          return valueKeys.every((key) => {
            if (keys.indexOf(key) === -1) {
              return false
            }

            return typeof value[key] === obj[key]
          })
        },
        default: () => Object({
          byte: 'B',
          kilobyte: 'KB',
          megabyte: 'MB',
          gigabyte: 'GB',
          terabyte: 'TB'
        })
      },
      uploader: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        state: {
          size: this.uploader.methods.getSize(this.id)
        }
      }
    },

    computed: {
      formatted () {
        return formatSizeAndUnits({ size: this.state.size, units: this.units })
      }
    },

    created () {
      const scalingOption = this.uploader.options.scaling

      if (scalingOption && scalingOption.sizes.length) {
        // If this is a scaled image, the size won't be known until upload time.
        this._onUploadHandler = id => {
          if (id === this.id) {
            this.$set(this.state, 'size', this.uploader.methods.getSize(id))
          }
        }
      }
    },

    mounted () {
      this._onUploadHandler && this.uploader.on('upload', this._onUploadHandler)
    },

    beforeDestroy () {
      this._onUploadHandler && this.uploader.off('upload', this._onUploadHandler)
    },

    beforeUpdate (nextProps, nextState) {
      return nextState.size !== this.state.size || !areUnitsEqual(nextProps.units, this.units)
    }
  }
</script>
