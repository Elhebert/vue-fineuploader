<template>
  <div>
    <slot></slot>
  </div>
</template>

<style lang="scss">
</style>

<script language="text/babel">
  import qq from 'fine-uploader/lib/core';

  export default {
    props: {
      options: {
        type: Object,
        default: () => Object(),
      },
      callbacks: {
        type: Object,
        default: () => Object(),
      },
    },

    mounted() {
      qq.FineUploaderBasic({
        ...this.options,
        callbacks: this.callbacks,
      });
    },
  };
</script>
