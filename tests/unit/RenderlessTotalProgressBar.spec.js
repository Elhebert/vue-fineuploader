import { shallowMount } from '@vue/test-utils'
import ProgressBar from '@/renderless/TotalProgressBar.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('renderless/FileProgressBar.vue', () => {
  it('is not uploading any file on initialisation', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = shallowMount(ProgressBar, {
      propsData: { uploader },
      scopedSlots: { default: slots => slots },
    })

    expect(wrapper.vm.uploading).toBe(false)
  })

  it('keeps track of the files progress during the upload', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = shallowMount(ProgressBar, {
      propsData: { uploader },
      scopedSlots: { default: slots => slots },
    })

    wrapper.vm.onProgress(100, 1000)

    expect(wrapper.vm.bytesUploaded).toBe(100)
    expect(wrapper.vm.totalSize).toBe(1000)
  })

  it('is no longer uploading when upload is finished', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = shallowMount(ProgressBar, {
      propsData: { uploader },
      scopedSlots: { default: slots => slots },
    })
    // uploading
    uploader.methods['getInProgress'] = jest.fn(() => 1)
    wrapper.vm.onStatusChange(
      0,
      uploader.qq.status.QUEUED,
      uploader.qq.status.UPLOADING,
    )

    expect(wrapper.vm.uploading).toBe(true)

    // done uploading
    uploader.methods['getInProgress'] = jest.fn(() => 0)
    wrapper.vm.onStatusChange(
      0,
      uploader.qq.status.UPLOADING,
      uploader.qq.status.UPLOAD_SUCCESSFUL,
    )

    expect(wrapper.vm.uploading).toBe(false)
  })
})
