import { shallowMount } from '@vue/test-utils'
import CancelButton from '@/renderless/CancelButton.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status } from 'fine-uploader/lib/core/all'

describe('RenderlessCancelButton.vue', () => {
  let wrapper
  let uploader

  const sampleBlob = new Blob(['hi!'], { type: 'text/plain' })

  beforeEach(done => {
    uploader = new FineUploader({ options: { autoUpload: false } })
    uploader.on('submitted', done)
    uploader.methods.addFiles(sampleBlob)

    wrapper = shallowMount(CancelButton, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: slots => slots },
    })
  })

  it('makes a file cancelable when added', () => {
    expect(wrapper.vm.cancelable).toBe(true)
  })

  it('cancels the upload if onClick is triggered', done => {
    wrapper.vm.onClick({ preventDefault: jest.fn() })

    wrapper.vm.$nextTick(() => {
      expect(uploader.methods.getUploads()[0].status).toMatch(status.CANCELED)
      expect(wrapper.vm.cancelable).toBe(false)

      done()
    })
  })
})
