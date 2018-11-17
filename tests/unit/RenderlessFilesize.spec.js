import { shallowMount } from '@vue/test-utils'
import Filesize from '@/renderless/Filesize.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('renderless/Filesize.vue', () => {
  const sampleBlob = new Blob(['hi!'], { type: 'text/plain' })
  const sampleBlobWrapper = { blob: sampleBlob, name: 'test' }
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

  it('renders file size for tiny file using default units/text', () => {
    const uploader = new FineUploader({ options: { autoUpload: false } })
    uploader.methods.addFiles(sampleBlobWrapper)

    const wrapper = shallowMount(Filesize, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: object => object },
    })

    expect(wrapper.vm.size).toBe(sampleBlob.size)
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
      { size: '1.10', units: 'kilobyte' },
      { size: '1.10', units: 'megabyte' },
      { size: '1.10', units: 'gigabyte' },
      { size: '1.10', units: 'terabyte' },
    ]

    expectedSizes.forEach((expectedSize, id) => {
      const wrapper = shallowMount(Filesize, {
        propsData: { id, uploader },
        scopedSlots: { default: object => object },
      })

      expect(wrapper.vm.formatted).toEqual({
        size: expectedSize.size,
        unit: expectedSize.units,
      })
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

    const wrapper = shallowMount(Filesize, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: object => object },
    })

    expect(wrapper.vm.size).toBe(-1)

    uploader.methods.getSize = jest.fn(() => 1)
    wrapper.vm.onUpload(0)

    expect(uploader.methods.getSize).toHaveBeenCalledWith(0)
    expect(wrapper.vm.formatted).toEqual({ size: 1, unit: 'byte' })
  })
})
