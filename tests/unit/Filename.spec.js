import { mount } from '@vue/test-utils'
import Filename from '@/Filename.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('Filename.vue', () => {
  let uploader
  let wrapper

  const sampleBlob = new Blob(['hi!'], { type: 'text/plain' })
  const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }

  beforeEach(done => {
    uploader = new FineUploader({ options: { autoUpload: false } })
    uploader.on('submitted', done)
    uploader.methods.addFiles(sampleBlobWrapper)

    wrapper = mount(Filename, {
      propsData: { id: 0, uploader },
    })
  })

  it('renders initial filename', () => {
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('test')
  })

  it('updates filename on setName', () => {
    uploader.methods.setName(0, 'new-name')

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('new-name')
  })
})
