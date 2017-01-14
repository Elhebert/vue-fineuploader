<template>
  <button aria-label='delete'
          class="vue-fine-uploader-delete-button"
          disabled="!this.state.deletable || this.state.deleting"
          @Click="this.state.deletable && !this.state.deleting && this._onClick">
      <slot></slot>
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
        require: true
      },
      onlyRenderIfDeletable: {
        type: Boolean,
        default: true
      },
      uploader: {
        type: Object,
        require: true
      }
    },

    data () {
      return {
        state: {
          deletable: false,
          deleting: false
        }
      }
    },

    moutned () {
      this.uploader.on('statusChange', this._onStatusChange)
    },

    beforeDestroy () {
      this._unmounted = true
      this._unregisterStatusChangeHandler()
    },

    methods: {
      _onStatusChange: (id, oldStatus, newStatus) => {
        if (id === this.id && !this._unmounted) {
          if (!isDeletable(newStatus) && newStatus !== 'deleting' && this.state.deletable) {
            !this._unmounted && this.setState({
              deletable: false,
              deleting: false
            })
            this._unregisterStatusChangeHandler()
          } else if (isDeletable(newStatus) && !this.state.deletable) {
            this.setState({
              deletable: true,
              deleting: false
            })
          } else if (newStatus === 'deleting' && !this.state.deleting) {
            this.setState({ deleting: true })
          }
        }
      },

      _onClick: () => this.uploader.methods.deleteFile(this.props.id),

      _unregisterStatusChangeHandler: () => {
        this.uploader.off('statusChange', this._onStatusChange)
      }
    }
  }
</script>
