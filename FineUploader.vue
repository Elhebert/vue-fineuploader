<template>
  <div>
    <slot></slot>
  </div>
</template>

<style lang="scss"></style>

<script language="text/babel">
  import qq from 'fine-uploader/lib/core';

  export default {
    props: {
      button: {
        type: String,
      },
      options: {
        type: Object,
        default: () => Object(),
      },
    },

    mounted() {
      /* eslint-disable no-new */
      new qq.FineUploaderBasic({
        button: window.document.querySelector(this.button),
        ...this.options,
        callbacks: {
          onAutoRetry: (id, name, attemptNumber) => {
            this.$emit('autoretry', { id, name, attemptNumber });
          },
          onCancel: (id, name) => {
            this.$emit('cancel', { id, name });
          },
          onComplete: (id, name, response, xhr) => {
            this.$emit('complete', { id, name, response, xhr });
          },
          onAllComplete: (succedded, failed) => {
            this.$emit('allcomplete', { succedded, failed });
          },
          onDelete: (id) => {
            this.$emit('delete', { id });
          },
          onDeleteComplete: (id, xhr, isError) => {
            this.$emit('deletecomplete', { id, xhr, isError });
          },
          onError: (id, name, errorReason, xhr) => {
            this.$emit('error', { id, name, errorReason, xhr });
          },
          onManualRetry: (id, name) => {
            this.$emit('manualretry', { id, name });
          },
          onPasteReceived: (blob) => {
            this.$emit('pastereceived', { blob });
          },
          onProgress: (id, name, uploadedBytes, totalBytes) => {
            this.$emit('progress', { id, name, uploadedBytes, totalBytes });
          },
          onResume: (id, name, chunckData) => {
            this.$emit('resume', { id, name, chunckData });
          },
          onSessionRequestComplete: (response, success, xhrOrxhd) => {
            this.$emit('sessionrequestcomplete', { response, success, xhrOrxhd });
          },
          onStatusChange: (id, oldStatus, newStatus) => {
            this.$emit('statuschange', { id, oldStatus, newStatus });
          },
          onSubmit: (id, name) => {
            this.$emit('submit', { id, name });
          },
          onSubmitDelete: (id) => {
            this.$emit('submitdelete', { id });
          },
          onSubmitted: (id, name) => {
            this.$emit('submitted', { id, name });
          },
          onTotalProgress: (totalUploadedBytes, totalBytes) => {
            this.$emit('totalprogess', { totalUploadedBytes, totalBytes });
          },
          onUpload: (id, name) => {
            this.$emit('upload', { id, name });
          },
          onUploadChunk: (id, name, chunckData) => {
            this.$emit('uploadChunck', { id, name, chunckData });
          },
          onUploadChunkSuccess: (id, chunckData, responseJSON, xhr) => {
            this.$emit('uploadchucnksuccess', { id, chunckData, responseJSON, xhr });
          },
          onValidate: (data, buttonContainer) => {
            this.$emit('validate', { data, buttonContainer });
          },
          onValidateBatch: (fileOrBlobDataArray, buttonContainer) => {
            this.$emit('validate', { fileOrBlobDataArray, buttonContainer });
          },
        },
      });
    },
  };
</script>
