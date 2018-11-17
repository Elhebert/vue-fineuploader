import { mount } from '@vue/test-utils'
import RetryButton from '@/RetryButton.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('RetryButton.vue', () => {
  let wrapper
  let renderless
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = mount(RetryButton, {
      propsData: { id: 0, uploader },
    })
    renderless = wrapper.vm.$children[0]
  })

  it('does not display retry button by default if upload has not failed', () => {
    renderless.onComplete(0, 'foo.bar', { success: true })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmpty()).toBe(true)
  })

  it('disables retry button if upload has not failed', () => {
    wrapper.setProps({ onlyRenderIfRetryable: false })
    renderless.onComplete(0, 'foo.bar', { success: true })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().disabled).toBeDefined()
  })

  it('displays retry button if upload has failed', () => {
    wrapper = mount(RetryButton, {
      propsData: { id: 0, uploader },
    })
    renderless = wrapper.vm.$children[0]

    renderless.onComplete(0, 'foo.bar', { success: false })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().disabled).toBeUndefined()
  })

  it('retries upload if button has been clicked', () => {
    renderless.onComplete(0, 'foo.bar', { success: false })
    uploader.methods.retry = jest.fn()
    wrapper.trigger('click')

    expect(wrapper).toMatchSnapshot()
    expect(uploader.methods.retry).toHaveBeenCalledWith(0)
  })

  it('does not display retry button by default if upload has failed and retries are forbidden (default response property)', () => {
    renderless.onComplete(0, 'foo.bar', { success: false, preventRetry: true })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmpty()).toBe(true)
  })

  it('does not display retry button by default if upload has failed and retries are forbidden (custom response property)', () => {
    const uploader = new FineUploader({
      options: { retry: { preventRetryResponseProperty: 'dontDareRetry' } },
    })
    wrapper.setProps({ uploader })
    renderless.onComplete(0, 'foo.bar', { success: false, dontDareRetry: true })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.isEmpty()).toBe(true)
  })

  it('disables retry button if upload has failed and retries are forbidden', () => {
    wrapper.setProps({ onlyRenderIfRetryable: false })
    renderless.onComplete(0, 'foo.bar', { success: false, preventRetry: true })

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.attributes().disabled).toBeDefined()
  })
})
