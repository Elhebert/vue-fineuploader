<template>
  <renderless-file-name
    :id="id"
    :uploader="uploader"
   >
    <span slot-scope="{ filename }">{{ filename }}</span>
  </renderless-file-name>
</template>

<script>
import RenderlessFileName from './renderless/Filename'

export default {
  components: {
    RenderlessFileName,
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    uploader: {
      type: Object,
      required: true,
    },
  },
}
</script>
