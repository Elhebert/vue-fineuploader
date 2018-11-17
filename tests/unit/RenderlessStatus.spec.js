import { shallowMount } from '@vue/test-utils'
import Status from '@/renderless/Status.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status as STATUSES } from 'fine-uploader/lib/core/all'

describe('renderless/Status.vue', () => {
  let wrapper
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = shallowMount(Status, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: slots => slots },
    })
  })

  it('saves the files new status on status change', () => {
    wrapper.vm.onStatusChange(0, STATUSES.UPLOAD_SUCCESSFUL, STATUSES.DELETING)

    expect(wrapper.vm.status).toBe(STATUSES.DELETING)
  })

  it('set the status to null for an untracked file', () => {
    wrapper.vm.onStatusChange(1, STATUSES.UPLOAD_SUCCESSFUL, STATUSES.DELETING)

    expect(wrapper.vm.status).toBeNull()
  })
})
