<template>
  <div>
    <div 
      class='vue-fine-uploader-gallery-nodrop-container'
      v-if="dropzoneDisabled"
    >
      <span v-if="hasVisibleFiles"/>
      <slot 
        name="content"
        v-else
      >
        <MaybeDropzoneContent
          :content="content"
          :disabled="dropzoneDisabled"
        />
      </slot>
      <slot></slot>
    </div>

    <Dropzone 
      class='vue-fine-uploader-gallery-dropzone'
      :uploader="uploader"
      :disabled="disabled"
      :dropActiveClassName="dropActiveClassName"
      :multiple="multiple"
      v-else
    >
      <span v-if="hasVisibleFiles"/>
      <slot 
        name="content"
        v-else
      >
        <MaybeDropzoneContent
          :content="content"
          :disabled="dropzoneDisabled"
        />
      </slot>
      <slot></slot>
    </Dropzone>
  </div>
</template>

<script>
  import Dropzone from '../dropzone'
  import MaybeDropzoneContent from './MaybeDropzoneContent'

  export default {
    components: {
      Dropzone,
      MaybeDropzoneContent
    },
    props: {
      disabled: {
        type: Boolean,
        required: true
      },
      hasVisibleFiles: {
        type: Boolean,
        required: true
      },
      uploader: {
        type: Object,
        required: true
      },
      dropActiveClassName: {
        type: String,
        default: 'vue-fine-uploader-gallery-dropzone-active'
      },
      multiple: {
        type: Boolean,
        default: true
      },
      // TODO: This might be wrong because it might be passed by props and not a string. Might be using slot instead to pass it down
      content: {
        type: String,
        default: ''
      }
    },
    computed: {
      dropzoneDisabled () {
        let dzD = this.disabled
        if (!dzD) {
          dzD = !this.uploader.qq.supportedFeatures.fileDrop
        }
        return dzD
      }
    }
  }
</script>