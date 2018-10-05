import { mount } from '@vue/test-utils'
import DeleteButton from '@/DeleteButton.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status } from 'fine-uploader/lib/core/all'

describe('DeleteButton.vue', () => {
  let wrapper
  let renderless
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = mount(DeleteButton, {
      propsData: { id: 0, uploader },
    })

    renderless = wrapper.vm.$children[0]
  })

  it('renders the button for a successfully uploaded file', () => {
    renderless.onStatusChange(0, null, status.UPLOAD_SUCCESSFUL)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.html()).toBeDefined()
    expect(wrapper.attributes().disabled).toBeUndefined()
  })

  it('deletes the file if clicked', () => {
    uploader.methods.deleteFile = jest.fn()

    renderless.onStatusChange(0, null, status.UPLOAD_SUCCESSFUL)

    wrapper.trigger('click')
    expect(uploader.methods.deleteFile).toHaveBeenCalled()
  })

  it('removes the button if the file can no longer be deleted', () => {
    renderless.onStatusChange(0, null, status.DELETED)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmpty()).toBe(true)
  })

  it('disabled the button while the delete is in progress', () => {
    renderless.onStatusChange(0, null, status.DELETING)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().disabled).toBeDefined()
  })

  it('disables the button if requested when the file can no longer be deleted', () => {
    wrapper.setProps({ onlyRenderIfDeletable: false })
    renderless.onStatusChange(0, null, status.DELETED)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.html()).toBeDefined()
    expect(wrapper.attributes().disabled).toBeDefined()
  })
})
