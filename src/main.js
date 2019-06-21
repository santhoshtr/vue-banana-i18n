import Banana from 'banana-i18n'

export default {
  install: function (Vue, messages = {}) {
    const banana = new Banana()
    banana.load(messages)

    const directive = {
      params: ['key', 'params'],
      bind: (el, binding) => {
        banana.setLocale(binding.value)
      },
      update: (el) => {
        el.innerText = this.vm.$i18n(this.params.key, this.params.params)
      }
    }

    Vue.directive('locale', directive)
    Vue.prototype.$i18n = (msgKey, ...params) => {
      // const locale = this.$root.locale || navigator.language || navigator.browserLanguage
      banana.setLocale('en')
      return banana.i18n(msgKey, ...params)
    }
    Vue.filter('i18n', (msgKey, ...params) => {
      this.$i18n(msgKey, ...params)
    })
  }
}
