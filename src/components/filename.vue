<template>
  <span class="vue-fine-uploader-filename">
    {{ this.state.filename }}
  </span>
</template>

<script>
  export default {
    props: {
      id: {
        type: Number,
        require: true
      },
      uploader: {
        type: Object,
        require: true
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
      shouldComponentUpdate: (nextProps, nextState) => nextState.filename !== this.state.filename,

      _interceptSetName: () => {
        const oldSetName = this.uploader.methods.setName

        this.uploader.methods.setName = (id, newName) => {
          oldSetName.call(this.uploader.methods, id, newName)

          if (id === this.id) {
            this.setState({
              filename: newName
            })
          }
        }
      }
    }
  }
</script>
