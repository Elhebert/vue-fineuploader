import { shallowMount } from '@vue/test-utils'
import ProgressBar from '@/renderless/FileProgressBar.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('renderless/FileProgressBar.vue', () => {
  it('is not uploading the file on initialisation', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = shallowMount(ProgressBar, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: slots => slots },
    })

    expect(wrapper.vm.uploading).toBe(false)
  })

  it('keeps track of the file progress during the upload', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = shallowMount(ProgressBar, {
      propsData: { id: 3, uploader },
      scopedSlots: { default: slots => slots },
    })

    wrapper.vm.onProgress(3, 'foo.jpeg', 100, 1000)

    expect(wrapper.vm.bytesUploaded).toBe(100)
    expect(wrapper.vm.totalSize).toBe(1000)
  })

  it('is no longer uploading when upload is finished', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = shallowMount(ProgressBar, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: slots => slots },
    })
    // uploading
    wrapper.vm.onStatusChange(
      0,
      uploader.qq.status.QUEUED,
      uploader.qq.status.UPLOADING,
    )

    expect(wrapper.vm.uploading).toBe(true)

    // done uploading
    wrapper.vm.onStatusChange(
      0,
      uploader.qq.status.UPLOADING,
      uploader.qq.status.UPLOAD_SUCCESSFUL,
    )

    expect(wrapper.vm.uploading).toBe(false)
  })
})
