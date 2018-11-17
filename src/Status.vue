<template>
  <renderless-status
    :id="id"
    :uploader="uploader"
  >
    <span slot-scope="{ status }">{{ statuses[status] }}</span>
  </renderless-status>
</template>

<script>
import RenderlessStatus from './renderless/Status'

export default {
  components: {
    RenderlessStatus,
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
    statuses: {
      deleting: 'Deleting...',
      paused: 'Paused',
      queued: 'Queued',
      retrying_upload: 'Retrying...',
      submitted: 'Submitted',
      submitting: 'Submitting...',
      uploading: 'Uploading...',
      upload_failed: 'Failed',
      upload_successful: 'Completed',
    },
  }),
}
</script>
