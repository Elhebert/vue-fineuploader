import { shallowMount } from '@vue/test-utils'
import Filename from '@/renderless/Filename.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('RenderlessFilename.vue', () => {
  let uploader
  let wrapper

  const sampleBlob = new Blob(['hi!'], { type: 'text/plain' })
  const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

  beforeEach(done => {
    uploader = new FineUploader({ options: { autoUpload: false } })
    uploader.on('submitted', done)
    uploader.methods.addFiles(sampleBlobWrapper)

    wrapper = shallowMount(Filename, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: object => object },
    })
  })

  it('set initial filename', () => {
    expect(wrapper.vm.filename).toBe('test')
  })

  it('update filename on setName', () => {
    uploader.methods.setName(0, 'new-name')

    expect(wrapper.vm.filename).toBe('new-name')
  })
})
