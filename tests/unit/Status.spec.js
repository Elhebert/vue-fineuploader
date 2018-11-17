import { mount } from '@vue/test-utils'
import Status from '@/Status.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status as STATUSES } from 'fine-uploader/lib/core/all'

describe('Status.vue', () => {
  let wrapper
  let uploader
  let renderless

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = mount(Status, {
      propsData: { id: 0, uploader },
    })
    renderless = wrapper.vm.$children[0]
  })

  it('render nothing for a different file', () => {
    renderless.onStatusChange(1, STATUSES.UPLOAD_SUCCESSFUL, STATUSES.DELETING)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('')
  })

  it('render nothing for an untracked status value', () => {
    renderless.onStatusChange(0, STATUSES.DELETING, STATUSES.DELETE_FAILED)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('')
  })

  it('renders the status for the tracked file', () => {
    renderless.onStatusChange(0, STATUSES.UPLOAD_SUCCESSFUL, STATUSES.DELETING)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.text()).toBe('Deleting...')
  })
})
