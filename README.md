<img class="nav-logo" src="https://vuejs.org/images/logo.png" width="32" height="32">
<a href="http://fineuploader.com/designers">
   <img src="http://fineuploader.smartimage.com/pimg/a8680d51" width="300">
</a>

[![npm](https://img.shields.io/npm/v/vue-fineuploader.svg)](https://www.npmjs.com/package/vue-fineuploader)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![Stackoverflow](https://img.shields.io/badge/ask-on%20stack%20overflow-brightgreen.svg)](http://stackoverflow.com/questions/tagged/fine-uploader)

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

### Quick Reference

- [Installing](#installing)
- [Wrapper Classes](#wrapper-classes)
   - [Azure](#azure) - upload files directly to Azure storage
   - [S3](#s3) - upload files to directly to an Amazon Simple Storage Service (S3) bucket. Your server must sign requests using a private key.
   - [Traditional](#traditional) - upload files to a server you created and control.
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

Simply `npm install vue-fine-uploader@v2.0.0-rc.3` and see the documentation for your specific integration instructions (based on your needs).

### Wrapper Classes

#### Azure

This enables you to upload to Azure directly. Your server must provide signature and done endpoints. The Azure uploading workflow is documented on the [Azure feature page](http://docs.fineuploader.com/branch/master/features/azure.html). Some examples servers can be found in the [server-examples repository](https://github.com/FineUploader/server-examples).

##### `constructor({ options })`

When creating a new instance of the Azure endpoint wrapper class, pass in an object that mirrors the format of the [Fine Uploader Azure Core options object](http://docs.fineuploader.com/branch/master/api/options-azure.html). This options property is entirely optional.

```javascript
import FineUploaderAzure from 'vue-fine-uploader/wrappers/azure'

const uploader = new FineUploaderAzure({
    options: {
      signature: {
        endpoint: '/upload/signature',
      },
      uploadSuccess: {
        endpoint: '/upload/done',
      }
    }
})
```

##### `on(eventName, handlerFunction)`

Register a new callback/event handler. The `eventName` can be formatted with _or_ without the 'on' prefix. If you do use the 'on', prefix, be sure to follow lower-camel-case exactly ('onSubmit', not 'onsubmit'). If a handler has already been registered for this event, yours will be added to the "pipeline" for this event. If a previously registered handler for this event fails for some reason or returns `false`, you handler will _not_ be called. Your handler function may return a `Promise` if it is [listed as an event type that supports promissory/thenable return values](http://docs.fineuploader.com/branch/master/features/async-tasks-and-promises.html#promissory-callbacks).

```javascript
uploader.on('complete', (id, name, response) => {
   // handle completed upload
})
```

##### `off(eventName, handlerFunction)`

Unregister a previously registered callback/event handler. Same rules for `eventName` as  the `on` method apply here. The `handlerFunction` _must_ be the _exact_ `handlerFunction` passed to the `on` method when you initially registered said function.

```javascript
const completeHandler = (id, name, response) => {
   // handle completed upload
})

uploader.on('complete', completeHandler)

// ...later
uploader.off('complete', completeHandler)
```

##### `options`

The `options` property you used when constructing a new instance, sans any `callbacks`.

##### `methods`

Use this property to access any [core API methods exposed by Fine Uploader Azure](http://docs.fineuploader.com/branch/master/api/methods-azure.html).

```javascript
uploader.methods.getResumableFilesData(myFiles)
```


#### S3

Use the traditional endpoint wrapper class if you would like to upload files directly to an Amazon Simple Storage Service (S3 bucket). Your server must be able to sign requests sent by Fine Uploader. If you enable the delete file feature, your server must handle these as well. You can read more about [S3 server requests in the documentation](http://docs.fineuploader.com/branch/master/endpoint_handlers/amazon-s3.html). The S3 uploading workflow is documented on the [S3 feature page](http://docs.fineuploader.com/branch/master/features/s3.html). Some examples servers can be found in the [server-examples repository](https://github.com/FineUploader/server-examples).

##### `constructor({ options })`

When creating a new instance of the S3 endpoint wrapper class, pass in an object that mirrors the format of the [Fine Uploader S3 Core options object](http://docs.fineuploader.com/branch/master/api/options-s3.html). You may also include a `callbacks` property to include any initial [core callback handlers](http://docs.fineuploader.com/branch/master/api/events-s3.html) that you might need. This options property is entirely optional though :laughing:.

```javascript
import FineUploaderS3 from 'vue-fine-uploader/wrappers/s3'

const uploader = new FineUploaderS3({
    options: {
        request: {
            endpoint: "http://fineuploadertest.s3.amazonaws.com",
            accessKey: "AKIAIXVR6TANOGNBGANQ"
        },
        signature: {
            endpoint: "/vendor/fineuploader/php-s3-server/endpoint.php"
        }
    }
})
```

##### `on(eventName, handlerFunction)`

Register a new callback/event handler. The `eventName` can be formatted with _or_ without the 'on' prefix. If you do use the 'on', prefix, be sure to follow lower-camel-case exactly ('onSubmit', not 'onsubmit'). If a handler has already been registered for this event, yours will be added to the "pipeline" for this event. If a previously registered handler for this event fails for some reason or returns `false`, you handler will _not_ be called. Your handler function may return a `Promise` if it is [listed as an event type that supports promissory/thenable return values](http://docs.fineuploader.com/branch/master/features/async-tasks-and-promises.html#promissory-callbacks).

```javascript
uploader.on('complete', (id, name, response) => {
   // handle completed upload
})
```

##### `off(eventName, handlerFunction)`

Unregister a previously registered callback/event handler. Same rules for `eventName` as  the `on` method apply here. The `handlerFunction` _must_ be the _exact_ `handlerFunction` passed to the `on` method when you initially registered said function.

```javascript
const completeHandler = (id, name, response) => {
   // handle completed upload
})

uploader.on('complete', completeHandler)

// ...later
uploader.off('complete', completeHandler)
```

##### `options`

The `options` property you used when constructing a new instance, sans any `callbacks`.

##### `methods`

Use this property to access any [core API methods exposed by Fine Uploader S3](http://docs.fineuploader.com/branch/master/api/methods-s3.html).

```javascript
uploader.methods.addFiles(myFiles)
uploader.methods.deleteFile(3)
```

#### Traditional

Use the traditional endpoint wrapper class if you would like to upload files to a server you control. Your server must handle _all_ requests sent by Fine Uploader, such as upload, delete file (optional), and chunking success (optional). You can read more about [traditional server requests in the documentation](http://docs.fineuploader.com/branch/master/endpoint_handlers/traditional.html). Some examples servers can be found in the [server-examples repository](https://github.com/FineUploader/server-examples).

##### `constructor({ options })`

When creating a new instance of the traditional endpoint wrapper class, pass in an object that mirrors the format of the [Fine Uploader Core options object](http://docs.fineuploader.com/branch/master/api/options.html). You may also include a `callbacks` property to include any initial [core callback handlers](http://docs.fineuploader.com/branch/master/api/events.html) that you might need. This options property is entirely optional.

```javascript
import FineUploaderTraditional from 'vue-fine-uploader'

const uploader = new FineUploaderTraditional({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      },
      callbacks: {
         onComplete: (id, name, response) => {
            // handle completed upload
         }
      }
   }
})
```

##### `on(eventName, handlerFunction)`

Register a new callback/event handler. The `eventName` can be formatted with _or_ without the 'on' prefix. If you do use the 'on', prefix, be sure to follow lower-camel-case exactly ('onSubmit', not 'onsubmit'). If a handler has already been registered for this event, yours will be added to the "pipeline" for this event. If a previously registered handler for this event fails for some reason or returns `false`, you handler will _not_ be called. Your handler function may return a `Promise` iff it is [listed as an event type that supports promissory/thenable return values](http://docs.fineuploader.com/branch/master/features/async-tasks-and-promises.html#promissory-callbacks).

```javascript
uploader.on('complete', (id, name, response) => {
   // handle completed upload
})
```

##### `off(eventName, handlerFunction)`

Unregister a previously registered callback/event handler. Same rules for `eventName` as  the `on` method apply here. The `handlerFunction` _must_ be the _exact_ `handlerFunction` passed to the `on` method when you initially registered said function.

```javascript
const completeHandler = (id, name, response) => {
   // handle completed upload
})

uploader.on('complete', completeHandler)

// ...later
uploader.off('complete', completeHandler)
```

##### `options`

The `options` property you used when constructing a new instance, sans any `callbacks`.

##### `methods`

Use this property to access any [core API methods exposed by Fine Uploader](http://docs.fineuploader.com/branch/master/api/methods.html).

```javascript
uploader.methods.addFiles(myFiles)
uploader.methods.deleteFile(3)
```


### High-level Components

#### `<gallery />`

Not implemented yet.

### Low-level Components

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
  import CancelButton from 'vue-fine-uploader/components/cancel-button'
  import FineUploaderTraditional from 'vue-fine-uploader'
  import Thumbnail from 'vue-fine-uploader/components/thumbnail'

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
  import DeleteButton from 'vue-fine-uploader/components/delete-button'
  import FineUploaderTraditional from 'vue-fine-uploader'
  import Thumbnail from 'vue-fine-uploader/components/thumbnail'

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

- `onDropError` - Directly maps to the [`callbacks.dropError` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#dropError). React Fine Uploader will log any errors when the underlying DnD instance invokes the `dropError` callback, but you can specify additional behavior as well.

- `onProcesssingDroppedFiles` - Directly maps to the [`callbacks.processingDroppedFiles` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#processingDroppedFiles).

- `onProcessingDroppedFilesComplete` - Directly maps to the [`callbacks.processingDroppedFilesComplete` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#processingDroppedFilesComplete). React Fine Uploader will send all files to the underlying Fine Uploader instance when this callback is invoked, but you may specify additional logic as well.

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
  import Dropzone from 'react-fine-uploader/components/dropzone'
  import FineUploaderTraditional from 'react-fine-uploader'

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

Not implemented yet

#### `<filename />`

The `<filename />` component renders the initial name of the associated file _and_ updates when the file's name is changed through the API.

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Suppose you wanted to render a filename for each file as new files are submitted to Fine Uploader. Your React component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```html
<template>
  <filename v-for="file in state.submittedFiles" :id="file.id" :uploader="uploader" />
</template>

<script>
  import FineUploaderTraditional from 'vue-fineuploader'
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

Suppose you wanted to render a file size for each file as new files are submitted to Fine Uploader. Your React component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```html
<template>
  <filesize v-for="file in state.submittedFiles" :id="file.id" :uploader="uploader" />
</template>

<script>
  import FineUploaderTraditional from 'vue-fineuploader'
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
  import FineUploaderTraditional from 'react-fine-uploader'
  import PauseResumeButton from 'react-fine-uploader/components/PauseResume-button'
  import Thumbnail from 'react-fine-uploader/components/thumbnail'

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
  import FineUploaderTraditional from 'vue-fineuploader'
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
  import FineUploaderTraditional from 'vue-fineuploader'
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

Not implemented yet
