import { mount } from '@vue/test-utils'
import CancelButton from '@/CancelButton.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status as STATUSES } from 'fine-uploader/lib/core/all'

describe('CancelButton.vue', () => {
  let wrapper
  let uploader

  const sampleBlob = new Blob(['hi!'], { type: 'text/plain' })

  beforeEach(done => {
    uploader = new FineUploader({ options: { autoUpload: false } })
    uploader.on('submitted', done)
    uploader.methods.addFiles(sampleBlob)

    wrapper = mount(CancelButton, {
      propsData: { id: 0, uploader },
    })
  })

  it('renders the button for a submitted file', () => {
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.html()).toBeDefined()
    expect(wrapper.attributes().disabled).toBeUndefined()
  })

  it('cancels the upload if clicked', done => {
    wrapper.trigger('click')

    wrapper.vm.$nextTick(() => {
      expect(uploader.methods.getUploads()[0].status).toMatch(STATUSES.CANCELED)

      done()
    })
  })

  it('removes the button by default if the file can no longer be canceled', done => {
    uploader.methods.cancel(0)

    wrapper.vm.$nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.isEmpty()).toBe(true)

      done()
    })
  })

  it('disables the button if requested when the file can no longer be canceled', done => {
    wrapper.setProps({ onlyRenderIfCancelable: false })
    uploader.methods.cancel(0)

    wrapper.vm.$nextTick(() => {
      expect(wrapper).toMatchSnapshot()
      expect(wrapper.html()).toBeDefined()
      expect(wrapper.attributes().disabled).toBeDefined()

      done()
    })
  })
})
