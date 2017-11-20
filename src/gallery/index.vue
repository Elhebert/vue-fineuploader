<!--
Notes:
- Transitions has been disabled
-->
<template>
  <MaybeDropzone 
    :hasVisibleFiles="this.state.visibleFiles.length > 0"
    :uploader="uploader"
    :disabled="dropzoneDisabled"
    :dropActiveClassName="dropzoneDropActiveClassName"
    :multiple="dropzoneMultiple"
  >
    <!-- TODO: Rendering Default Content when it is null -->
    <!-- Current idea would be to bring MaybeDropzoneContent up to here -->
    <!-- <div slot="content"><slot name="content"></slot></div> -->

    <FileInputComponent 
      :multiple="fileInputMultiple"
      :uploader="uploader"
    />
    <ProgressBar 
      class='vue-fine-uploader-gallery-total-progress-bar'
      :uploader="uploader"
    />

    <!-- TODO: Import Transition similar to ReactCssTransitionGroup -->
    <ul class="vue-fine-uploader-gallery-files">
      <li 
        :key="id"
        class='vue-fine-uploader-gallery-file'
        v-for="({ id, status, fromServer }) in state.visibleFiles"
      >
        <ProgressBar 
          class='vue-fine-uploader-gallery-progress-bar'
          :id="id"
          :uploader="uploader"
        />
        <Thumbnail 
          class='vue-fine-uploader-gallery-thumbnail'
          :id="id"
          :fromServer="fromServer"
          :uploader="uploader"
          :maxSize="thumbnailMaxSize"
        />
        
        <span v-if="status === 'upload successful'">
          <UploadSuccessIcon class='vue-fine-uploader-gallery-upload-success-icon' />
          <div class='vue-fine-uploader-gallery-thumbnail-icon-backdrop' />
        </span>

        <span v-if="status === 'upload failed'">
          <UploadFailedIcon class='vue-fine-uploader-gallery-upload-failed-icon' />
          <div class='vue-fine-uploader-gallery-thumbnail-icon-backdrop' />
        </span>

        <div class='vue-fine-uploader-gallery-file-footer'>
          <Filename 
            class='vue-fine-uploader-gallery-filename'
            :id="id"
            :uploader="uploader"
          />
            <Status 
              class='vue-fine-uploader-gallery-status'
              :id="id"
              :uploader="uploader"
            />
            <Filesize 
              class='vue-fine-uploader-gallery-filesize'
              :id="id"
              :uploader="uploader"
            />
        </div>
                  
        <CancelButton 
          class='vue-fine-uploader-gallery-cancel-button'
          :id="id"
          :uploader="uploader"
        >
          <slot><XIcon /></slot>
        </CancelButton>
        <RetryButton 
          class='vue-fine-uploader-gallery-retry-button'
          :id="id"
          :uploader="uploader"
        >
          <slot><PlayIcon /></slot>
        </RetryButton>
        <DeleteButton 
          class='vue-fine-uploader-gallery-delete-button'
          :id="id"
          :uploader="uploader"
          v-if="deleteEnabled"
        >
          <slot><XIcon /></slot> 
        </DeleteButton>
        <PauseResumeButton 
          class='vue-fine-uploader-gallery-pause-resume-button'
          :id="id"
          :uploader="uploader"
          v-if="chunkingEnabled"
        >
          <slot>
            <div slot="resume"><PlayIcon /></div>
            <div slot="pause"><PauseIcon /></div>
          </slot>
        </PauseResumeButton>
      </li>
    </ul>
  </MaybeDropzone>
</template>

<script>
  import CancelButton from '../cancel-button'
  import DeleteButton from '../delete-button'
  import Dropzone from '../dropzone'
  import FileInput from '../file-input'
  import Filename from '../filename'
  import Filesize from '../filesize'
  import RetryButton from '../retry-button'
  import PauseResumeButton from '../pause-resume-button'
  import ProgressBar from '../progress-bar'
  import Status from '../status'
  import Thumbnail from '../thumbnail'
  import PauseIcon from './pause-icon'
  import PlayIcon from './play-icon'
  import UploadIcon from './upload-icon'
  import UploadFailedIcon from './upload-failed-icon'
  import UploadSuccessIcon from './upload-success-icon'
  import XIcon from './x-icon'
  import MaybeDropzone from './MaybeDropzone'
  import FileInputComponent from './FileInputComponent'

  import './gallery.css'

  const isFileGone = (statusToCheck, statusEnum) => {
    return [
      statusEnum.CANCELED,
      statusEnum.DELETED
    ].indexOf(statusToCheck) >= 0
  }

  export default {
    components: {
      CancelButton,
      DeleteButton,
      Dropzone,
      FileInput,
      Filename,
      Filesize,
      RetryButton,
      PauseResumeButton,
      ProgressBar,
      Status,
      Thumbnail,
      PauseIcon,
      PlayIcon,
      UploadIcon,
      UploadFailedIcon,
      UploadSuccessIcon,
      XIcon,
      MaybeDropzone,
      FileInputComponent
    },
    props: {
      // TODO: Change all the jsx types to another format
      uploader: {
        type: Object,
        required: true
      },
      className: {
        type: String,
        default: ''
      },
      fileInputMultiple: {
        default: true
      },
      dropzoneDisabled: {
        default: false
      },
      dropzoneDropActiveClassName: {
        default: 'vue-fine-uploader-gallery-dropzone-active'
      },
      dropzoneMultiple: {
        default: true
      },
      thumbnailMaxSize: {
        default: 130
      }
    },
    mounted () {
      this.uploader.on('statusChange', this._onStatusChange)
    },
    destroyed () {
      this.uploader.off('statusChange', this._onStatusChange)
    },
    data () {
      return {
        state: {
          visibleFiles: []
        }
      }
    },
    computed: {
      chunkingEnabled () {
        return this.uploader.options.chunking && this.uploader.options.chunking.enabled
      },
      deleteEnabled () {
        return this.uploader.options.deleteFile && this.uploader.options.deleteFile.enabled
      }
    },
    methods: {
      _onStatusChange (id, oldStatus, status) {
        const statusEnum = this.uploader.qq.status
        const visibleFiles = this.state.visibleFiles

        if (status === statusEnum.SUBMITTED) {
          visibleFiles.push({ id })
          this.state.visibleFiles = visibleFiles
        } else if (isFileGone(status, statusEnum)) {
          this._removeVisibleFile(id)
        } else if (status === statusEnum.UPLOAD_SUCCESSFUL || status === statusEnum.UPLOAD_FAILED) {
          if (status === statusEnum.UPLOAD_SUCCESSFUL) {
            const visibleFileIndex = this._findFileIndex(id)
            if (visibleFileIndex < 0) {
              visibleFiles.push({ id, fromServer: true })
            }
          }
          this._updateVisibleFileStatus(id, status)
        }
      },

      _removeVisibleFile (id) {
        const visibleFileIndex = this._findFileIndex(id)

        if (visibleFileIndex >= 0) {
          const visibleFiles = this.state.visibleFiles

          visibleFiles.splice(visibleFileIndex, 1)
          this.state.visibleFiles = visibleFiles
        }
      },

      _updateVisibleFileStatus (id, status) {
        this.state.visibleFiles.some(file => {
          if (file.id === id) {
            file.status = status
            // TODO: Trigger an update. Currently, complete isn't showing unless another action occurs. If the code below is enabled, there is a bug where it does not delete properly
            // Vue Code
            // this.state.visibleFiles = { ...this.state.visibleFiles };
            // React Code
            // this.setState({ visibleFiles: this.state.visibleFiles })
            return true
          }
        })
      },

      _findFileIndex (id) {
        let visibleFileIndex = -1

        this.state.visibleFiles.some((file, index) => {
          if (file.id === id) {
            visibleFileIndex = index
            return true
          }
        })

        return visibleFileIndex
      }
    }
  }
</script>