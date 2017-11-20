<template>
  <span :class="rootClass">
    <canvas :class="canvasClass"
        :hidden="isHidden"
        ref="canvas"
    />
    <!-- React { this._maybePlaceholder } -->
    <Placeholder 
      :class="placeholderClass"
      :size="maxSize"
      :status="notAvailableStatus"
      v-if="_failure"
    >
      <slot name="notAvailablePlaceholder">
        <NotAvailablePlaceholder :maxSize="maxSize" />
      </slot>
    </Placeholder>
    <Placeholder
      :class="placeholderClass"
      :size="maxSize"
      :status="waitingStatus"
      v-else-if="!drawComplete"
    >
      <slot name="waitingPlaceholder">
        <WaitingPlaceholder :maxSize="maxSize" />
      </slot>
    </Placeholder>
  </span>
</template>

<script>
  import Placeholder from './placeholder'
  import NotAvailablePlaceholder from './not-available-placeholder'
  import WaitingPlaceholder from './waiting-placeholder'

  const defaultMaxSize = 120
  const notAvailableStatus = 'not-available'
  const waitingStatus = 'waiting'

  export default {
    components: {
      Placeholder,
      NotAvailablePlaceholder,
      WaitingPlaceholder
    },
    props: {
      customResizer: {
        type: Function
      },
      fromServer: {
        type: Boolean
      },
      id: {
        type: Number,
        required: true
      },
      maxSize: {
        type: Number,
        default: defaultMaxSize
      },
      uploader: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        drawComplete: false,
        notAvailableStatus,
        waitingStatus,
        placeholderClass: `vue-fine-uploader-thumbnail ${this.class || ''}`,
        rootClass: `vue-fine-uploader-thumbnail-container ${(this.class && this.class + '-container') || ''}`,
        canvasClass: `vue-fine-uploader-thumbnail ${this.class || ''}`
      }
    },
    computed: {
      isHidden () {
        return !this.drawComplete || this._failure
      },
      _failure () {
        return this.drawComplete && !this.success
      }
    },
    mounted () {
      this.uploader.methods.drawThumbnail(
          this.id,
          this.$refs.canvas,
          this.maxSize,
          this.fromServer,
          this.customResizer
        )
        .then(
          () => {
            this.drawComplete = true
            this.success = true
          },
          () => {
            this.drawComplete = true
            this.success = false
          }
        )
    }
  }
</script>