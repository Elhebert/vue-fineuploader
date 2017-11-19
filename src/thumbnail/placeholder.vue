<template>
  <div :class="className" :style="style">
    <!-- Represents React {{ image }} -->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      // Passed through slot
      // image: {
      //  // type: node??,
      //  required: true,
      // },
      size: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        style: {
          display: 'inline-block',
          maxHeight: this.size,
          maxWidth: this.size
        },
        className: `react-fine-uploader-thumbnail-placeholder react-fine-uploader-thumbnail-${this.status} ${this.className || ''}`
      }
    }
  }
</script>