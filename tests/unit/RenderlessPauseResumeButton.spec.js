import { shallowMount } from '@vue/test-utils'
import PauseResumeButton from '@/renderless/PauseResumeButton.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status } from 'fine-uploader/lib/core/all'

describe('renderless/PauseResumeButton.vue', () => {
  let wrapper
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = shallowMount(PauseResumeButton, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: object => object },
    })
  })

  it('pausable is false until the first chunk has been uploaded', () => {
    expect(wrapper.vm.pausable).toBe(false)

    wrapper.vm.onUploadChunk(0, null, { partIndex: 3 })

    expect(wrapper.vm.pausable).toBe(true)
  })

  it('pausable is false when the upload is no longer actionable', () => {
    wrapper.vm.onUploadChunk(0, null, { partIndex: 1 })

    expect(wrapper.vm.pausable).toBe(true)

    wrapper.vm.onStatusChange(0, null, status.DELETED)

    expect(wrapper.vm.pausable).toBe(false)
  })

  it('allows a paused upload to be resumed and then paused again', () => {
    wrapper.vm.onUploadChunk(0, null, { partIndex: 7 })
    wrapper.vm.onStatusChange(0, null, status.PAUSED)

    expect(wrapper.vm.pausable).toBe(false)
    expect(wrapper.vm.resumable).toBe(true)

    uploader.methods.continueUpload = jest.fn()
    wrapper.vm.onClick({ preventDefault: jest.fn() })
    expect(uploader.methods.continueUpload).toHaveBeenCalledWith(0)

    wrapper.vm.onStatusChange(0, null, status.UPLOADING)

    expect(wrapper.vm.pausable).toBe(true)
    expect(wrapper.vm.resumable).toBe(false)

    uploader.methods.pauseUpload = jest.fn()
    wrapper.vm.onClick({ preventDefault: jest.fn() })
    expect(uploader.methods.pauseUpload).toHaveBeenCalledWith(0)

    wrapper.vm.onStatusChange(0, null, status.PAUSED)

    expect(wrapper.vm.pausable).toBe(false)
    expect(wrapper.vm.resumable).toBe(true)
  })

  it('allows a resumed file to be paused immediately', () => {
    wrapper.vm.onResume(0)

    expect(wrapper.vm.pausable).toBe(true)
    expect(wrapper.vm.resumable).toBe(false)
  })
})
