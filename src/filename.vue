<template>
  <span class="vue-fine-uploader-filename">
    {{ this.state.filename }}
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
      uploader: {
        type: Object,
        required: true
      }
    },

    data () {
      return {
        state: {
          filename: this.uploader.methods.getName(this.id)
        }
      }
    },

    created () {
      this._interceptSetName()
    },

    methods: {
      shouldComponentUpdate (nextProps, nextState) {
        return nextState.filename !== this.state.filename
      },

      _interceptSetName () {
        const oldSetName = this.uploader.methods.setName

        this.uploader.methods.setName = (id, newName) => {
          oldSetName.call(this.uploader.methods, id, newName)

          if (id === this.id) {
            this.$set(this.state, 'filename', newName)
          }
        }
      }
    }
  }
</script>
