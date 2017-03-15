<template>
    <div class="vue-fine-uploader-file-input">
        <label :for="inputID">
            <slot>Upload File</slot>
        </label>
        <input type="file"
               :id="inputID"
               @change="_onFilesSelected"
               :multiple="multiple"/>
    </div>
</template>

<style>
    .vue-fine-uploader-file-input {
        display: inline-block;
    }

    .vue-fine-uploader-file-input label {
        cursor: pointer;
    }

    .vue-fine-uploader-file-input input[type="file"] {
        width: 1px;
        height: 1px;
        opacity: 0;
    }
</style>

<script>
    // Input/label pairs should have unique, matching IDs.
    const randomID = () => Math.floor(Math.random() * (9999 - 1000)) + 1000;

    export default {
        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            uploader: {
                type: Object,
                required: true
            }
        },

        data () {
            return {
                _unmounted: false,
                inputID: `file-input-${randomID()}`
            }
        },

        beforeDestroy () {
            this._unmounted = true;
        },

        methods: {
            _onFilesSelected (e) {
                this.uploader.methods.addFiles(e.target);
            }
        }
    }
</script>
