import Banana from 'banana-i18n'

export default {
  install (Vue, options = {
    messages: {},
    locale: 'en'
  }) {
    const banana = new Banana(options.locale, options)
    Vue.prototype.$i18n = (msgKey, ...params) => {
      return banana.i18n(msgKey, ...params)
    }

    Vue.prototype.setLocale = (locale) => {
      banana.setLocale(locale)
    }
    /**
     * Load localized messages for a locale
     * If locale not provided, the keys in messageSource will be used as locales.
     * @param {Object} messageSource
     * @param {string} [locale]
     */
    Vue.prototype.loadMessages = (messages, locale) => {
      banana.load(messages, locale)
    }
  }
}
