import { mount } from '@vue/test-utils'
import Filesize from '@/Filesize.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('Filesize.vue', () => {
  const nativeObjectToString = Object.prototype.toString

  beforeEach(() => {
    Object.prototype.toString = function() {
      if (this && this.type === 'fakeBlob') {
        return '[object Blob]'
      }

      return nativeObjectToString.apply(this, arguments)
    }
  })

  afterEach(() => {
    Object.prototype.toString = nativeObjectToString
  })

  it('renders an empty filesize component if size is not known initially', () => {
    const uploader = new FineUploader({ options: { autoUpload: false } })
    uploader.methods.addFiles({ type: 'fakeBlob' })

    const wrapper = mount(Filesize, {
      propsData: { id: 0, uploader },
    })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('')
  })

  it('renders formatted file size for various sized files', () => {
    const uploader = new FineUploader({ options: { autoUpload: false } })

    uploader.methods.addFiles([
      { size: 1100, type: 'fakeBlob' },
      { size: 1100000, type: 'fakeBlob' },
      { size: 1100000000, type: 'fakeBlob' },
      { size: 1100000000000, type: 'fakeBlob' },
    ])

    const expectedSizes = [
      { size: '1.10', units: 'KB' },
      { size: '1.10', units: 'MB' },
      { size: '1.10', units: 'GB' },
      { size: '1.10', units: 'TB' },
    ]

    expectedSizes.forEach((expectedSize, id) => {
      const wrapper = mount(Filesize, {
        propsData: { id, uploader },
      })

      expect(wrapper).toMatchSnapshot()
      expect(wrapper.text()).toBe(`${expectedSize.size} ${expectedSize.units}`)
    })
  })

  it('renders file size at upload time for scaled blobs', () => {
    const uploader = new FineUploader({
      options: {
        autoUpload: false,
        scaling: { sizes: [{ name: 'test', maxSize: 100 }] },
      },
    })
    uploader.methods.addFiles({ type: 'fakeBlob' })

    const wrapper = mount(Filesize, {
      propsData: { id: 0, uploader },
    })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('')

    uploader.methods.getSize = jest.fn(() => 1)

    const renderless = wrapper.vm.$children[0]
    renderless.onUpload(0)

    expect(uploader.methods.getSize).toHaveBeenCalledWith(0)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toEqual('1 B')
  })
})
