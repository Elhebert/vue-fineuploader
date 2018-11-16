import { mount } from '@vue/test-utils'
import ProgressBar from '@/ProgressBar.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('ProgressBar.vue', () => {
  it('hides the progress bar by default', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = mount(ProgressBar, { propsData: { id: 0, uploader } })

    expect(wrapper.attributes().hidden).toBeDefined()
    expect(wrapper).toMatchSnapshot()

    wrapper = mount(ProgressBar, { propsData: { uploader } })

    expect(wrapper.attributes().hidden).toBeDefined()
    expect(wrapper).toMatchSnapshot()

  })

  it('shows the file progress bar before uploading start if specified', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = mount(ProgressBar, {
      propsData: { id: 0, uploader, hidesWhenNotUploading: false },
    })

    expect(wrapper.attributes().hidden).toBeUndefined()
    expect(wrapper).toMatchSnapshot()
  })

  it('shows the total progress bar before uploading start if specified', () => {
    const uploader = new FineUploader({ options: {} })
    let wrapper = mount(ProgressBar, {
      propsData: { uploader, hidesWhenNotUploading: false },
    })

    expect(wrapper.attributes().hidden).toBeUndefined()
    expect(wrapper).toMatchSnapshot()
  })

  it('show the file progress if an ID is supplied', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = mount(ProgressBar, { propsData: { id: 3, uploader } })
    const renderless = wrapper.vm.$children[0]

    renderless.onProgress(3, 'foo.jpeg', 100, 1000)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().style).toBe('width: 10%;')
  })

  it('show the total progress if no ID is supplied', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = mount(ProgressBar, { propsData: { uploader } })
    const renderless = wrapper.vm.$children[0]

    renderless.onProgress(100, 1000)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().style).toBe('width: 10%;')
  })

  it('hides total progress bar after all uploads are complete', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = mount(ProgressBar, { propsData: { uploader } })
    const renderless = wrapper.vm.$children[0]

    // uploading
    uploader.methods['getInProgress'] = jest.fn(() => 1)
    renderless.onStatusChange(
      0,
      uploader.qq.status.QUEUED,
      uploader.qq.status.UPLOADING,
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeUndefined()

    // done uploading
    uploader.methods['getInProgress'] = jest.fn(() => 0)
    renderless.onStatusChange(
      0,
      uploader.qq.status.UPLOADING,
      uploader.qq.status.UPLOAD_SUCCESSFUL,
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeDefined()
  })

  it('hides file progress bar after all upload is complete', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = mount(ProgressBar, { propsData: { id: 0, uploader } })
    const renderless = wrapper.vm.$children[0]

    // uploading
    renderless.onStatusChange(0, uploader.qq.status.QUEUED, uploader.qq.status.UPLOADING)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeUndefined()

    // done uploading
    renderless.onStatusChange(0, uploader.qq.status.UPLOADING, uploader.qq.status.UPLOAD_SUCCESSFUL)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeDefined()
  })

  it('shows total progress bar after all uploads are complete if requested', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = mount(ProgressBar, {
      propsData: { uploader, hidesWhenNotUploading: false },
    })
    const renderless = wrapper.vm.$children[0]

    // uploading
    uploader.methods['getInProgress'] = jest.fn(() => 1)
    renderless.onStatusChange(0, uploader.qq.status.QUEUED, uploader.qq.status.UPLOADING)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeUndefined()

    // done uploading
    uploader.methods['getInProgress'] = jest.fn(() => 0)
    renderless.onStatusChange(0, uploader.qq.status.UPLOADING, uploader.qq.status.UPLOAD_SUCCESSFUL)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeUndefined()
  })

  it('shows file progress bar after all upload is complete if requested', () => {
    const uploader = new FineUploader({ options: {} })
    const wrapper = mount(ProgressBar, {
      propsData: { id: 0, uploader, hidesWhenNotUploading: false },
    })
    const renderless = wrapper.vm.$children[0]

    // uploading
    renderless.onStatusChange(0, uploader.qq.status.QUEUED, uploader.qq.status.UPLOADING)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeUndefined()

    // done uploading
    renderless.onStatusChange(0, uploader.qq.status.UPLOADING, uploader.qq.status.UPLOAD_SUCCESSFUL)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().hidden).toBeUndefined()
  })
})
