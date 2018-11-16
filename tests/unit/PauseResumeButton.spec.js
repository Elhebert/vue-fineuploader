import { mount } from '@vue/test-utils'
import PauseResumeButton from '@/PauseResumeButton.vue'
import FineUploader from 'fine-uploader-wrappers'
import { status as STATUSES } from 'fine-uploader/lib/core/all'

describe('PauseResumeButton.vue', () => {
  let wrapper
  let renderless
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = mount(PauseResumeButton, {
      propsData: { id: 0, uploader },
    })

    renderless = wrapper.vm.$children[0]
  })

  it("doesn't render the button until the first chunk has been uploaded", () => {
    expect(wrapper.isEmpty()).toBe(true)
    expect(wrapper).toMatchSnapshot()

    renderless.onUploadChunk(0, null, { partIndex: 3 })

    expect(wrapper.html()).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  it('removes the pause button when the upload is no longer actionable', () => {
    renderless.onUploadChunk(0, null, { partIndex: 1 })

    expect(wrapper.html()).toBeDefined()
    expect(wrapper).toMatchSnapshot()

    renderless.onStatusChange(0, null, STATUSES.DELETED)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.html()).toBeUndefined()
  })

  it('disables the button, if requested, when the upload is no longer actionable', () => {
    wrapper.setProps({ onlyRenderIfEnabled: false })

    renderless.onUploadChunk(0, null, { partIndex: 1 })

    expect(wrapper.html()).toBeDefined()
    expect(wrapper).toMatchSnapshot()

    renderless.onStatusChange(0, null, STATUSES.DELETED)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.html()).toBeDefined()
    expect(wrapper.attributes().disabled).toBeDefined()
  })
})
