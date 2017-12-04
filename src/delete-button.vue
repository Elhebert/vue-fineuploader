<template>
  <button v-if="!onlyRenderIfDeletable || state.deletable"
          type="button"
          aria-label="delete"
          class="vue-fine-uploader-delete-button"
          :disabled="!state.deletable || state.deleting"
          @click="_onClick">
      <slot>Delete</slot>
  </button>
</template>

<style lang="css"></style>

<script>
  const isDeletable = status => {
    return [
      'delete failed',
      'upload successful'
    ].indexOf(status) >= 0
  }

  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      onlyRenderIfDeletable: {
        type: Boolean,
        default: true
      },
      uploader: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        state: {
          deletable: false,
          deleting: false
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

    methods: {
      _onStatusChange (id, oldStatus, newStatus) {
        if (id === this.id && !this._unmounted) {
          if (!isDeletable(newStatus) && newStatus !== 'deleting' && this.state.deletable) {
            !this._unmounted && this.$set(this.state, 'deletable', false)
            !this._unmounted && this.$set(this.state, 'deleting', false)
            this._unregisterStatusChangeHandler()
          } else if (isDeletable(newStatus) && !this.state.deletable) {
            this.$set(this.state, 'deletable', true)
            this.$set(this.state, 'deleting', false)
          } else if (newStatus === 'deleting' && !this.state.deleting) {
            this.$set(this.state, 'deleting', false)
          }
        }
      },

      _onClick () {
        if (this.state.deletable && !this.state.deleting) {
          this.uploader.methods.deleteFile(this.id)
        }
      },

      _unregisterStatusChangeHandler () {
        this.uploader.off('statusChange', this._onStatusChange)
      }
    }
  }
</script>
