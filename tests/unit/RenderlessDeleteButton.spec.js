import { shallowMount } from '@vue/test-utils'
import DeleteButton from '@/renderless/DeleteButton.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status as STATUSES } from 'fine-uploader/lib/core/all'

describe('RenderlessDeleteButton.vue', () => {
  let wrapper
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = shallowMount(DeleteButton, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: slots => slots },
    })
  })

  it('makes the file deletable on successfully uploaded', () => {
    wrapper.vm.onStatusChange(0, null, STATUSES.UPLOAD_SUCCESSFUL)

    expect(wrapper.vm.deletable).toBe(true)
  })

  it('deletes the file if onClick is trigger', () => {
    uploader.methods.deleteFile = jest.fn()

    wrapper.vm.onStatusChange(0, null, STATUSES.UPLOAD_SUCCESSFUL)

    wrapper.vm.onClick({ preventDefault: jest.fn() })
    expect(uploader.methods.deleteFile).toHaveBeenCalled()
  })

  it('makes the files undeletable by default if the file can no longer be deleted', () => {
    wrapper.vm.onStatusChange(0, null, STATUSES.DELETED)

    expect(wrapper.vm.deleting).toBe(false)
    expect(wrapper.vm.deletable).toBe(false)
  })

  it('makes the files undeletable while the delete is in progress', () => {
    wrapper.vm.onStatusChange(0, null, STATUSES.DELETING)

    expect(wrapper.vm.deleting).toBe(true)
    expect(wrapper.vm.deletable).toBe(false)
  })
})
