<template>
  <renderless-filesize
    :id="id"
    :uploader="uploader"
  >
    <span
      v-if="size !== null && size >= 0"
      slot-scope="{ size, unit }"
    >{{ size }} {{ units[unit] }}</span>
  </renderless-filesize>
</template>

<script>
import RenderlessFilesize from './renderless/Filesize'

export default {
  components: {
    RenderlessFilesize,
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

  data: () => ({
    units: {
      byte: 'B',
      kilobyte: 'KB',
      megabyte: 'MB',
      gigabyte: 'GB',
      terabyte: 'TB',
    },
  }),
}
</script>
