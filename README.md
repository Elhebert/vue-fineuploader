<img class="nav-logo" src="https://vuejs.org/images/logo.png" width="32" height="32">
<a href="http://fineuploader.com/designers">
   <img src="http://fineuploader.smartimage.com/pimg/a8680d51" width="300">
</a>

[![npm](https://img.shields.io/npm/v/vue-fineuploader.svg)](https://www.npmjs.com/package/vue-fineuploader)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

Makes using [Fine Uploader](http://fineuploader.com) in a VueJS 2 app simple. Drop-in high-level components for a turn-key UI. Use small focused components to build a more custom UI.

**This is a in-progress project, that is based on [react-fine-uploader](https://github.com/FineUploader/react-fine-uploader), which is still an unstable in-progress project**


## Docs

### Overview

Vue Fine Uploader makes using Fine Uploader and all of its unique features very simple in a Vue-based project. Thie library provides useful resources that can be divided into three sections:

#### Individual focused components (like `<thumbnail>` and `<progress-bar>`).

These allow you to easily build a highly customizable and powerful UI for your upload widget, backed by Fine Uploader's core feature set. Most of these components are unstyled (i.e. ready to be styled by you). Focused component-specific stylesheets may be provided at a later date.


#### Higher-order components (like `<gallery>`)

These combine many focused components that provide style (which can be adjusted via your own stylesheet) and enhanced UI-specific features. These components are essentially "turn-key", which means that you can get a fully functional upload widget up and running in your project with a few lines of code. Keep in mind that you of course still need a server to handle the requests sent by Fine Uploader and to server up the JavaScript and CSS files.

#### Wrapper classes

These wrap a Fine Uploader instance for use in Vue Fine Uploader. They provide additional features such as the ability to dynamically register multiple event/callback listeners. All individual and higher-order/focused components require you to pass a constructed wrapper class instance.

More information, such as examples and API documentation, can be found in the README of the [fine-uploader-wrappers project](https://github.com/FineUploader/fine-uploader-wrappers).

### Quick Reference

- [Installing](#installing)
- [High-level Components](#high-level-components)
   - [`<gallery />`](#gallery-)
- [Low-level Components](#low-level-components)
   - [`<cancel-button />`](#cancel-button-)
   - [`<delete-button />`](#delete-button-)
   - [`<dropzone />`](#dropzone-)
   - [`<file-input />`](#file-input-)
   - [`<filename />`](#filename-)
   - [`<filesize />`](#filesize-)
   - [`<pause-resume-button />`](#pause-resume-button-)
   - [`<progress-bar />`](#progress-bar-)
   - [`<retry-button />`](#retry-button-)
   - [`<status />`](#status-)
   - [`<thumbnail />`](#thumbnail-)

### Installing

Two dependencies that you will need to install yourself: an A+/Promise spec compliant polyfill (for IE11) and VueJS 2 (which is a peer dependency). This version is still in beta.

Simply `npm install vue-fineuploader@next` and see the documentation for your specific integration instructions (based on your needs).

### High-level Components

#### `<gallery />`

Similar to the Fine Uploader UI gallery template, the `<gallery />` component lays out an uploader using all of the available [low-level components](#low-level-components). Appealing styles are provided, which can be easily overriden in your own style sheet.

In the `<gallery />` component, each file is rendered as a "card". CSS transitions are used to fade a card in when a file is submitted and then fade it out again when the file is either canceled during uploading or deleted after uploading. By default, a file input element is rendered and styled to allow access to the file chooser. And, if supported by the device, a drop zone is rendered as well.

##### Properties

The only required property is `uploader`, which must be a Fine Uploader [wrapper class](#wrapper-classes) instance.

```js
<template>
  <Gallery :uploader="uploader" />
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrappers'
  import Gallery from 'vue-fineuploader/gallery'

  export default {
    components: {
      Gallery
    },
    data () {
      const uploader = new FineUploaderTraditional({
        options: {
          deleteFile: {
            enabled: true,
            endpoint: 'my/upload/endpoint'
          },
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        uploader
      }
    }
  }
</script>
```

##### Todos
- Implement animation
- Fix progress bar
- Fix slot for content

### Low-level Components

#### Script

```js
<template>
  <div>
    <file-input multiple accept='image/*' :uploader="uploader">
      <Dropzone 
        class="dropzone"
        :uploader="uploader" 
        :multiple="true"
      >
        <span>Drop Files Here / Click to Upload Files</span>
      </Dropzone>
    </file-input>

    <div v-for="file in state.submittedFiles">
      <thumbnail :id="file" :uploader="uploader" />
      <cancel-button :id="file" :uploader="uploader" />
      <delete-button :id="file" :uploader="uploader" />
    </div>
  </div>
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrappers'
  import Thumbnail from 'vue-fineuploader/thumbnail'
  import Dropzone from 'vue-fineuploader/dropzone'
  import FileInput from 'vue-fineuploader/file-input'
  import DeleteButton from 'vue-fineuploader/delete-button'
  import CancelButton from 'vue-fineuploader/cancel-button'
  
  import 'fine-uploader/fine-uploader/fine-uploader.css'

  export default {
    components: {
      Dropzone,
      FileInput,
      Thumbnail,
      DeleteButton,
      CancelButton
    },
    data () {
      const uploader = new FineUploaderTraditional({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        uploader,
        state: {
          submittedFiles: []
        }
      }
    },

    mounted () {
      this.uploader.on('statusChange', (id, oldStatus, newStatus) => {
        if (newStatus === 'submitted') {
          const submittedFiles = this.state.submittedFiles
          submittedFiles.push(id)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        } else if (isFileGone(newStatus)) {
          const submittedFiles = this.state.submittedFiles
          const indexToRemove = submittedFiles.indexOf(id)

          submittedFiles.splice(indexToRemove, 1)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        }
      })
    }
  }

  const isFileGone = status => {
    return [
      'canceled',
      'deleted'
    ].indexOf(status) >= 0
  }
</script>

<style>
  .dropzone { 
    border: 1px dotted;
    height: 200px;
    width: 500px;
  }
</style>
```

#### `<cancel-button />`

The `<cancel-button />` component allows you to easily render a useable cancel button for a submitted file. An file can be "canceled" at any time, except after it has uploaded successfully, and before it has passed validation (and of course after it has already been canceled).

By default, the `<cancel-button />` will be rendered and clickable only when the associated file is eligible for cancelation. Otherwise, the component will _not_ render a button. In other words, once, for example, the associated file has been canceled or has uploaded successfully, the button will essentially disappear. You can change this behavior by setting appropriate options.

##### Slots

- *unamed* - child elements/components of `<cancel-button>`. Use this for any text of graphics that you would like to display inside the rendered button. If the component is childless, the button will be rendered with a simple text node of "Cancel".

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfCancelable` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is not cancelable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a cancel button for each submitted file along with a [`<thumbnail />`](#thumbnail-), and will ensure the elements representing a file are removed if the file is canceled.

```html
<template>
  <div v-for="file in state.submittedFiles">
    <thumbnail :id="file.id" uploader="uploader" />
    <cancel-button :id="file.id" uploader="uploader" />
  </div>
</template>

<script>
  import CancelButton from 'vue-fineuploader/components/cancel-button'
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import Thumbnail from 'vue-fineuploader/components/thumbnail'

  export default {
    components: {
      Thumbnail,
      CancelButton
    },

    data () {
      const uploader = new FineUploader({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        uploader,
        state: {
          submittedFiles: []
        }
      }
    },

    mounted() {
      this.uploader.on('statusChange', (id, oldStatus, newStatus) => {
        if (newStatus === 'submitted') {
          const submittedFiles = this.state.submittedFiles

          submittedFiles.push(id)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        }
        else if (isFileGone(newStatus)) {
          const submittedFiles = this.state.submittedFiles
          const indexToRemove = submittedFiles.indexOf(id)

          submittedFiles.splice(indexToRemove, 1)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        }
      })
    },

    methods: {
      isFileGone(status) {
        return [
          'canceled',
          'deleted'
        ].indexOf(status) >= 0
      }
    }
  }
</script>
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<cancel-button />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<delete-button />`

The `<delete-button />` component allows you to easily render a useable delete button for an uploaded file. An file can be deleted from the server if the option has been enabled and if the file has already uploaded successfully.

By default, the `<delete-button />` will be rendered and clickable only when the associated file is eligible for deletion. Otherwise, the component will _not_ render a button. In other words, once, for example, the associated file has been deleted, or while it is still uploading, the button will not be visible. You can change this behavior by setting appropriate options.

##### Slots

- *unamed* - child elements/components of `<delete-button>`. Use this for any text of graphics that you would like to display inside the rendered button. If the component is childless, the button will be rendered with a simple text node of "Delete".


##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfDeletable` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is not deletable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a delete button for each submitted file along with a [`<thumbnail />`](#thumbnail-), and will ensure the elements representing a file are removed if the file is deleted.

```html
<template>
  <div v-for="file in state.submittedFiles">
    <thumbnail :id="file.id" uploader="uploader" />
    <delete-button :id="file.id" uploader="uploader" />
  </div>
</template>

<script>
  import DeleteButton from 'vue-fineuploader/components/delete-button'
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import Thumbnail from 'vue-fineuploader/components/thumbnail'

  export default {
    components: {
      Thumbnail,
      DeleteButton
    },

    data () {
      const uploader = new FineUploader({
        options: {
          deleteFile: {
            enabled: true,
            endpoint: 'my/delete/endpoint'
          },
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        uploader,
        state: {
          submittedFiles: []
        }
      }
    },

    mounted() {
      this.uploader.on('statusChange', (id, oldStatus, newStatus) => {
        if (newStatus === 'submitted') {
          const submittedFiles = this.state.submittedFiles

          submittedFiles.push(id)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        }
        else if (isFileGone(newStatus)) {
          const submittedFiles = this.state.submittedFiles
          const indexToRemove = submittedFiles.indexOf(id)

          submittedFiles.splice(indexToRemove, 1)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        }
      })
    },

    methods: {
      isFileGone(status) {
        return [
          'canceled',
          'deleted'
        ].indexOf(status) >= 0
      }
    }
  }
</script>
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<delete-button />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<dropzone />`

This component provides an element that will accept dropped files or directories to be passed on to an underlying Fine Uploader instance. By default, the rendered component itself will accept these files, but you can also register another element in the DOM (such as `document.body`) to receive dropped files instead.

##### Properties

- `dropActiveClassName` - Directly maps to the [`classes.dropActive property` on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#classes.dropActive).

- `multiple` - Directly maps to the [`allowMultipleItems` property on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#allowMultipleItems).

- `onDropError` - Directly maps to the [`callbacks.dropError` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#dropError). Vue Fine Uploader will log any errors when the underlying DnD instance invokes the `dropError` callback, but you can specify additional behavior as well.

- `onProcesssingDroppedFiles` - Directly maps to the [`callbacks.processingDroppedFiles` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#processingDroppedFiles).

- `onProcessingDroppedFilesComplete` - Directly maps to the [`callbacks.processingDroppedFilesComplete` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#processingDroppedFilesComplete). Vue Fine Uploader will send all files to the underlying Fine Uploader instance when this callback is invoked, but you may specify additional logic as well.

- `uploader` - The only required option - a Fine Uploader [wrapper class](#wrapper-classes).

A _very_ simple but completely functional and effective use of the `<dropzone />` component can be seen below. This will render an element on the page that accepts files (all supported browsers) or even directories (Chrome & Opera only) and then submits them to Fine Uploader:

```html
<template>
  <dropzone :style="{ border: '1px dotted', height: 200, width: 200 }"
            :uploader="uploader">
    <span>Drop Files Here</span>
  </Dropzone>
</template>

<script>
  import Dropzone from 'vue-fineuploader/components/dropzone'
  import FineUploaderTraditional from 'fine-uploader-wrapper'

  export default {
    components: {
      Dropzone
    },

    data () {
      const uploader = new FineUploaderTraditional({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        uploader
      }
    }
  }
</script>
```

#### `<file-input />`

The `<file-input />` component allows you to easily render and style an `<input type="file">` element and connect it to a Fine Uploader instance. When any files are selected via the file chooser dialog, they will be submitted directly to the associated Fine Uploder instance.

##### Properties

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

For example, suppose you wanted to create a file input button with an upload icon and some text that allows the user to select multiple files, but excludes everything but images in the chooser dialog ([where supported](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Browser_compatibility)). When files are selected by the user, they should be submitted directly to a Fine Uploader traditional endpoint handler:

Note: This assumes you have [the Ionicons CSS file](http://ionicons.com/#cdn) loaded on your page.

```html
<template>
  <file-input multiple accept='image/*' :uploader="uploader">
    <span class="icon ion-upload">Choose Files</span>
  </file-input>
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import FileInput from 'vue-fineuploader/components/file-input'

  export default {
    data () {
      const uploader = new FineUploader({
        options: {
            request: {
              endpoint: 'my/upload/endpoint'
            }
        }
      })

      return {
        uploader
      }
    },

    component: {
      FileInput
    }
  }
</script>
```

You may pass _any_ [standard `<input type="file">` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) to the `<file-input />` component.


#### `<filename />`

The `<filename />` component renders the initial name of the associated file _and_ updates when the file's name is changed through the API.

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Suppose you wanted to render a filename for each file as new files are submitted to Fine Uploader. Your Vue component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```html
<template>
  <filename v-for="file in state.submittedFiles" :id="file" :uploader="uploader" />
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import Filename from 'vue-fineuploader/components/filename'

  export default {
    data () {
      const uploader = new FineUploader({
        options: {
            request: {
              endpoint: 'my/upload/endpoint'
            }
        }
      })

      return {
        state: {
            submittedFiles: []
        },
        uploader
      }
    },

    component: {
      Filename
    },

    mounted () {
      this.uploader.on('submitted', id => {
        const submittedFiles = this.state.submittedFiles

        submittedFiles.push(id)
        this.$set(this.state, 'submittedFiles', submittedFiles)
      })
    }
  }
</script>
```

#### `<filesize />`

The `<filesize />` component renders the size of a specific file, formatted based on the a set of customizable rules.
It also accounts for scaled images, which do not have a file size available until upload time.

The internal logic of this component uses the IEEE definition when determining whether to display the
size as kilobytes, megabytes, gigabytes, or terabytes. For example, 1100 bytes is represented, by default,
as "1.10 KB".

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `units` - An object containing printable text for each size unit. The size unit keys include
`byte`, `kilobyte`, `megabyte`, `gigabyte`, and `terabyte`. The default text values for these units are
`B`, `KB`, `MB`, `GB`, and `TB` (respectively).

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Suppose you wanted to render a file size for each file as new files are submitted to Fine Uploader. Your Vue component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```html
<template>
  <filesize v-for="file in state.submittedFiles" :id="file" :uploader="uploader" />
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import Filesize from 'vue-fineuploader/components/filesize'

  export default {
    data () {
      const uploader = new FineUploader({
        options: {
            request: {
              endpoint: 'my/upload/endpoint'
            }
        }
      })

      return {
        state: {
            submittedFiles: []
        },
        uploader
      }
    },

    components: {
      Filesize
    },

    mounted () {
      this.uploader.on('submitted', id => {
        const submittedFiles = this.state.submittedFiles

        submittedFiles.push(id)
        this.$set(this.state, 'submittedFiles', submittedFiles)
      })
    }
  }
</script>
```

If you wanted to display units as "bytes", "kilobytes", etc (instead of the default text), your `FileSize`
component would look like this instead:

```javascript
const customUnits = {
    byte: 'bytes',
    kilobyte: 'kilobytes',
    megabyte: 'megabytes',
    gigabyte: 'gigabytes',
    terabyte: 'terabytes'
}

<filesize :id="id" :units="customUnits" :uploader="uploader" />
```

#### `<pause-resume-button />`

The `<pause-resume-button />` component allows you to easily render a useable pause/resume button for a submitted file. An file can be "paused" manually when the upload is in progress after at least one chunk has uploaded successfully. A paused upload can then be resumed by pressing the same button.

When a file can be paused, the word "Pause" will appear in the button if no `pauseChildren` property has been specified. When it can be resumed, the button will be changed to "Resume" if no `resumeChildren` property has been defined. The former case will pause the upload on click, and the latter will resume. If the file cannot be paused or resumed, by default, the button will not be rendered.

##### Slots

- `pause` - child elements/components of `<pause-resume-button>`. Use this for any text of graphics that you would like to display inside the rendered pause button. If the component is childless, the button will be rendered with a simple text node of "Pause".
- `resume` - child elements/components of `<pause-resume-button>`. Use this for any text of graphics that you would like to display inside the rendered pause button. If the component is childless, the button will be rendered with a simple text node of "Resume".

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfEnabled` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is both not pausable and not resumable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a pause/resume button for each submitted file along with a [`<thumbnail />`](#thumbnail-).

```html
<template>
  <div v-for="file in state.submittedFiles">
      <thumbnail :id="file.id" :uploader="uploader" />
      <pause-resume-button :id="file.id" :uploader="uploader" />
  </div>
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import PauseResumeButton from 'vue-fineuploader/components/PauseResume-button'
  import Thumbnail from 'vue-fineuploader/components/thumbnail'

  export default {
    data () {
      const uploader = new FineUploader({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        state: {
          submittedFiles: []
        },
        uploader
      }
    },

    components: {
      PauseResumeButton,
      Thumbnail
    },

    mounted () {
      this.uploader.on('submitted', id => {
        const submittedFiles = this.state.submittedFiles

        submittedFiles.push(id)
        this.$set(this.state, 'submittedFiles', submittedFiles)
      })
    }
  }
</script>
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<PauseResumeButton />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<progress-bar />`

The ProgressBar component allows for a per-file _or_ a total progress bar to be rendered and automatically updated
by the underlying upload wrapper instance. This covers the per-file and total progress bar elements found in Fine Uploader UI. This progress bar itself is made up of a container element and a child element that marks the file progress.

##### Properties

- `id` - If this is a per-file progress bar, specify the ID of the file to monitor. For a total progress bar, omit this
property.

- `hideBeforeStart` - Defaults to `true`, which ensures the progress bar is not visible until the associated file has
started uploading. For total progress bars, this stays hidden until at least one file has started uploading.

- `hideOnComplete` - Defaults to `true`, which ensures the progress bar is no longer visible once the associated file
has completed uploading. For total progress bars, the bar is hidden once _all_ files have completed uploading.

- `uploader` - The only required option - a Fine Uploader [wrapper class](#wrapper-classes).

Consider embedding a per-file `<progress-bar />`, such as `<progress-bar :id="3" :uploader="uploader" />`, alongside
a [`<thumbnail />` component](#thumbnail-) for the same file. A total progress bar - `<progress-bar :uploader="uploader" />` - should probably be included before the container element that holds all file
`<thumbnail />` elements, such as at the top of a [`<dropzone />`](#dropzone-).

#### `<retry-button />`

The `<retry-button />` component allows you to easily render a useable retry button for a submitted file. An file can be "retried" manually after all auto retries have been exhausted on an upload failed _and_ if the [server has not forbidden retries in the upload response](http://docs.fineuploader.com/branch/master/api/options.html#retry.preventRetryResponseProperty).

By default, the `<retry-button />` will be rendered and clickable only when the associated file is eligible to be manually retried. Otherwise, the component will _not_ render a button. In other words, once, for example, the associated file has been canceled or has uploaded successfully, the button will essentially disappear. You can change this behavior by setting appropriate options

##### Slots

- *unamed* - child elements/components of `<retry-button>`. Use this for any text of graphics that you would like to display inside the rendered button. If the component is childless, the button will be rendered with a simple text node of "Retry".

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfRetryable` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is not retryable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a retry button for each submitted file along with a [`<thumbnail />`](#thumbnail-).

```html
<template>
  <div v-for="file in state.submittedFiles">
    <thumbnail :id="file.id" :uploader="uploader" />
    <retry-button :id="file.id" :uploader="uploader" />
  </div>
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import RetryButton from 'vue-fineuploader/components/retry-button'
  import Thumbnail from 'vue-fineuploader/components/thumbnail'

  export default {
    data () {
      const uploader = new FineUploader({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        state: {
          submittedFiles: []
        },
        uploader
      }
    },

    components: {
      RetryButton,
      Thumbnail
    },

    mounted() {
      this.uploader.on('statusChange', (id, oldStatus, newStatus) => {
        if (newStatus === 'submitted') {
          const submittedFiles = this.state.submittedFiles

          submittedFiles.push(id)
          this.$set(this.state, 'submittedFiles', submittedFiles)
        }
      })
    }
  }
</script>
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<retry-button />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<status />`

The `<status />` component renders the current status of a file in a format appropriate for display. You may also override one or more default display values.

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `text` - An object containing a map of status keys to display values. You may override one or more of these entries. Each entry with default values is listed below.
   - `deleting` - 'Deleting...'
   - `paused` - 'Paused'
   - `queued` - 'Queued'
   - `retrying_upload` - 'Retrying...'
   - `submitting` - 'Submitting...'
   - `uploading` - 'Uploading...'
   - `upload_failed` - 'Failed'
   - `upload_successful` - 'Completed'

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Below, the current status of each file is rendered underneath its thumbnail. As the status changes, so does the rendered text. The display value for the `upload_success` status has also been overridden to display as "Success!"

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```html
<template>
  <div v-for="file in state.submittedFiles">
    <thumbnail :id="file.id" :text="{ upload_successful: 'Success!' }" :uploader="uploader" />
    <status :id="file.id" :uploader="uploader" />
  </div>
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrapper'
  import Status from 'vue-fineuploader/components/retry-button'
  import Thumbnail from 'vue-fineuploader/components/thumbnail'

  export default {
    data () {
      const uploader = new FineUploader({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        state: {
          submittedFiles: []
        },
        uploader
      }
    },

    components: {
      Status,
      Thumbnail
    },

    mounted () {
      this.uploader.on('submitted', id => {
        const submittedFiles = this.state.submittedFiles

        submittedFiles.push(id)
        this.$set(this.state, 'submittedFiles', submittedFiles)
      })
    }
  }
</script>
```

#### `<thumbnail />`
The `<Thumbnail />` component allows you to easily render Fine Uploader generated thumbnail previews for a specific submitted file. While the thumbnail generation is in progress, a SVG "waiting" graphic will render. Of the thumbnail generation succeeds, the "waiting" graphic will be removed from the DOM and replaced with a <canvas> element containing the thumbnail preview. If thumbnail generation fails, a "not available" SVG graphic will be rendered instead.

##### Properties
- `customResizer(resizeInfo)` - An optional function that allows you to use a custom/3rd-library to resize thumbnail images. Documented further in [Fine Uploader's `drawThumbnail` API method documentation](https://docs.fineuploader.com/api/methods.html#drawThumbnail). See the second code example below for details.

- `fromServer` - Specify whether the current file was set from [initial file](https://docs.fineuploader.com/branch/master/features/session.html)

- `id` - The Fine Uploader ID of the submitted file. (required)

- `maxSize` - Maps directly to the [`maxSize` parameter](http://docs.fineuploader.com/branch/master/api/methods.html#drawThumbnail) of the Fine Uploader `drawThumbnail` API method. If not supplied a default value is used, which is exported as a named constant.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Suppose you wanted to render a thumbnail for each file as new files are submitted to Fine Uploader. Your React component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

##### Slots
- `notAvailablePlaceholder` - A custom element to display if the thumbnail is not available.

- `waitingPlaceholder` - A custom element to display while waiting for the thumbnail.

Suppose you wanted to render a thumbnail for each file as new files are submitted to Fine Uploader. Your Vue component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```js
<template>
  <div v-for="file in state.submittedFiles">
    <thumbnail :id="file" :uploader="uploader" />
    <cancel-button :id="file" :uploader="uploader" />
    <delete-button :id="file" :uploader="uploader" />
  </div>
</template>

<script>
  import FineUploaderTraditional from 'fine-uploader-wrappers'
  import Thumbnail from 'vue-fineuploader/thumbnail'

  export default {
    components: {
      Thumbnail
    },
    data () {
      const uploader = new FineUploaderTraditional({
        options: {
          request: {
            endpoint: 'my/upload/endpoint'
          }
        }
      })

      return {
        uploader,
        state: {
          submittedFiles: []
        }
      }
    },

    mounted () {
      this.uploader.on('submitted', id => {
        const submittedFiles = this.state.submittedFiles
        submittedFiles.push(id)
        this.$set(this.state, 'submittedFiles', submittedFiles)
      })
    }
  }
</script>
```
