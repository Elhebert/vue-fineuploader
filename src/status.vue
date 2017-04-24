<template>
<!-- Because of inline elements and whitespace, we remove the whitespace using
comments so that we don't interrupt text flow where this component is used -->
<!-- --><span class="vue-fine-uploader-status"><!--
          -->{{ state.status }}<!--
     --></span>
</template>

<style lang="css"></style>

<script>
  import isPlainObject from 'lodash.isplainobject'

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
            submitted: 'string',
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
          submitted: 'Submitted',
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
        submitted: 'Submitted',
        submitting: 'Submitting...',
        uploading: 'Uploading...',
        upload_failed: 'Failed',
        upload_successful: 'Completed'
      }

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

      // Read the status of the file when we start up
      // in case it was already submitted, and there won't be a
      // status change event to react to.
      const uploads = this.uploader.methods.getUploads()
      let fileStatus = null

      uploads.forEach(function(upload) {
        if (upload.id === this.id) {
          fileStatus = upload.status
        }
      }, this);

      if (fileStatus !== null) {
        this._onStatusChange(this.id, null, fileStatus);
      }
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterStatusChangeHandler()
    },

    watch: {
      text (newValue, oldValue) {
        this.$set(this.state, 'text', Object.assign({}, this.state.text, newValue))
      }
    },

    methods: {
      _onStatusChange (id, oldStatus, newStatus) {
        if (id === this.id && !this._unmounted) {
          const newStatusToDisplay = this.getStatusToDisplay({
            displayMap: this.state.text,
            status: newStatus
          })

          newStatusToDisplay && this.$set(this.state, 'status', newStatusToDisplay)
        }
      },

      _unregisterStatusChangeHandler () {
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
