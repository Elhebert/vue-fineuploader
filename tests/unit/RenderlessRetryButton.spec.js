import { shallowMount } from '@vue/test-utils'
import RetryButton from '@/renderless/RetryButton.vue'
import FineUploader from 'fine-uploader-wrappers'

describe('renderless/RetryButton.vue', () => {
  let wrapper
  let uploader

  beforeEach(() => {
    uploader = new FineUploader({ options: {} })

    wrapper = shallowMount(RetryButton, {
      propsData: { id: 0, uploader },
      scopedSlots: { default: slots => slots },
    })
  })

  it('is not retryable if upload has not failed', () => {
    wrapper.vm.onComplete(0, 'foo.bar', { success: true })

    expect(wrapper.vm.retryable).toBe(false)
  })

  it('is retryable if upload has failed', () => {
    wrapper.vm.onComplete(0, 'foo.bar', { success: false })

    expect(wrapper.vm.retryable).toBe(true)
  })

  it('retries upload if onClick is triggered', () => {
    wrapper.vm.onComplete(0, 'foo.bar', { success: false })
    uploader.methods.retry = jest.fn()
    wrapper.vm.onClick()

    expect(uploader.methods.retry).toHaveBeenCalledWith(0)
  })

  it('is not retryable if upload has failed and retries are forbidden (default response property)', () => {
    wrapper.vm.onComplete(0, 'foo.bar', { success: false, preventRetry: true })

    expect(wrapper.vm.retryable).toBe(false)
  })

  it('is not retryable if upload has failed and retries are forbidden (custom response property)', () => {
    const uploader = new FineUploader({
      options: { retry: { preventRetryResponseProperty: 'dontDareRetry' } },
    })
    wrapper.setProps({ uploader })
    wrapper.vm.onComplete(0, 'foo.bar', { success: false, dontDareRetry: true })

    expect(wrapper.vm.retryable).toBe(false)
  })
})
