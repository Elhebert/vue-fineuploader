# vue-fineuploader

[![Build Status](https://travis-ci.org/Elhebert/vue-fineuploader.svg?branch=master)](https://travis-ci.org/Elhebert/vue-fineuploader)
[![Dependency Status](https://david-dm.org/Elhebert/vue-fineuploader.svg)](https://david-dm.org/Elhebert/vue-fineuploader)
[![devDependency Status](https://david-dm.org/Elhebert/vue-fineuploader/dev-status.svg)](https://david-dm.org/Elhebert/vue-fineuploader?type=dev)

A VueJS 2 Component for Fine Uploader's core.

## New Version In Progress

I'm refactoring the `vue-fineuploader` component to be more customisable and to use all the options that fineuploader offer.
You can see the **WIP** here [vue-fineuploader/feature/refactor](https://github.com/Elhebert/vue-fineuploader/tree/feature/refactor). This new version is based on the react components (https://github.com/FineUploader/react-fine-uploader).

It'll offer a wrapper for each endpoints of fineuploader, and a component for all the UI options (dropzone, fileinput, cancel-button, ...).

Be sure to check it out, and help in anyway you can, porting a component or the documenation, everyone can help !

ETA: end of January.

---


## Usage

### Installation

Get the `FineUploader` component:

- with npm:
```
npm install --save vue-fineuploader
```
- clone this repository and copy the `FineUploader.vue` into your project:
```
git clone https://github.com/Elhebert/vue-fineuploader.git
```


### Properties

- `button`: Specify an element to use as the 'select files' button. Cannot be a `<button>`.
- `options`: Object containing the different configuration options.

For information on the possible [options](http://docs.fineuploader.com/branch/master/api/options.html) take a look at the official documentation

### Events

From the official documentation :
> Fine Uploader's event system enables integrators to execute any operations at almost any point in the upload process. Knowing how these callbacks work, and when they are called, is crucial to unlocking the full potential of Fine Uploader.

vue-fineuploader simply emit the different callbacks. Use the `v-on:<event>` or `@<event>` to listen to them.

In the FineUploader documentation the callbacks are functions with parameters, the events that are emitted for vue-fineuplaoder are returning a payload objects using those paramaters has key.

For example, the `onSubmit` callback has an `id` and a `name` as parameters. The `submit` event from vue-fineuploader will return the following object : `{ id: <id>, name: <name> }`.


For information on the different [events](http://docs.fineuploader.com/branch/master/api/events.html) take a look at the official documentation


#### Event naming

In the official documentation, the events are called `onEvent`, using a camelCase notation. vue-fineuploader events are using camelcase notation and don't use the prefix `on`.

For example, to listen to the `onAllComplete` callback, you need to listen to the `allcomplete` event.

### Example

```js
<template>
    <div>
        <FineUplaoder :button="button"
                      :options="options"
                      @submit="addFileToQueue">
            <div class="browse">browse</div>
        </FineUplaoder>
    </div>
</template>

<style></style>

<script language="text/babel">
import FineUplaoder from './path/to/FineUploader.vue'; // If you copied the component into your project
import FineUploader from 'vue-fineuploader'; // If you used npm to install the component

export default {
    data() {
        return {
            button: '.browse',
            options: {
                request: {
                    endpoint: '/path/to/your/endpoint'
                },
                ...
            },
        };
    },

    components: { FineUploader },

    methods: {
        addFileToQueue(payload) {
            ...
        },
    },
};
</script>
```

This script is published under the [MIT license](./LICENSE)
