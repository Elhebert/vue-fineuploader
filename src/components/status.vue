<template>
  <span class="vue-fine-uploader-status">
    {{ state.status }}
  </span>
</template>

<style lang="css"></style>

<script>
  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      text: {
        type: Object,
        validator: (value) => {
          const obj = {
            deleting: 'string',
            paused: 'string',
            queued: 'string',
            retrying_upload: 'string',
            submitting: 'string',
            uploading: 'string',
            upload_failed: 'string',
            upload_successful: 'string'
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
          deleting: 'Deleting...',
          paused: 'Paused',
          queued: 'Queued',
          retrying_upload: 'Retrying...',
          submitting: 'Submitting...',
          uploading: 'Uploading...',
          upload_failed: 'Failed',
          upload_successful: 'Completed'
        })
      },
      uploader: {
        type: Object,
        required: true
      }
    },

    data () {
      const defaultText = {
        deleting: 'Deleting...',
        paused: 'Paused',
        queued: 'Queued',
        retrying_upload: 'Retrying...',
        submitting: 'Submitting...',
        uploading: 'Uploading...',
        upload_failed: 'Failed',
        upload_successful: 'Completed'
      };

      return {
        state: {
          status: '',
          text: Object.assign({}, defaultText, this.text || {})
        },
        _unmounted: false
      }
    },

    mounted () {
      this.uploader.on('statusChange', this._onStatusChange)
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterStatusChangeHandler()
    },

    watch: {
      text (newValue, oldValue) {
        this.$set(this.state, 'text', objectAssign({}, this.state.text, newValue))
      }
    },

    methods: {
      _onStatusChange (id, oldStatus, newStatus) {
        if (id === this.props.id && !this._unmounted) {
          const newStatusToDisplay = this.getStatusToDisplay({
            displayMap: this.state.text,
            status: newStatus
          })

          newStatusToDisplay && this.$set(this.state, 'status', newStatusToDisplay)
        }
      },

       _unregisterStatusChangeHandler() {
        this.uploader.off('statusChange', this._onStatusChange)
      },

      getStatusToDisplay ({ displayMap, status }) {
        let key

        if (status.indexOf(' ') > 0) {
          const statusParts = status.split(' ')

          key = `${statusParts[0]}_${statusParts[1]}`
        } else {
          key = status
        }

        return displayMap[key]
      }
    }
  }
</script>
