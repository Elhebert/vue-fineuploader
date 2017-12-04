<template>
  <div :class="className" :style="style">
    <!-- Represents React {{ image }} -->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
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
        className: `vue-fine-uploader-thumbnail-placeholder vue-fine-uploader-thumbnail-${this.status} ${this.className || ''}`
      }
    }
  }
</script>