import { install, Vue } from './install'
import assert from 'assert'
import Banana from 'banana-i18n'

class VueBananaI18n {
  constructor (options = {}) {
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    this.options = options
    this.bananai18n = null
  }

  init (app /* Vue component instance */) {
    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(VueBananaI18n)\` ` +
      `before creating root instance.`
    )

    // main app previously initialized
    if (this.bananai18n) {
      return
    }
    this.bananai18n = new Banana(this.options.locale, this.options)
  }

  get locale () {
    return this.bananai18n.locale
  }

  set locale (locale) {
    this.bananai18n.setLocale(locale)
  }

  i18n (msgKey, ...params) {
    return this.bananai18n.i18n(msgKey, ...params)
  }

  loadMessages (messages, locale) {
    this.bananai18n.load(messages, locale)
  }
}

VueBananaI18n.install = install

const inBrowser = typeof window !== 'undefined'

if (inBrowser && window.Vue) {
  window.Vue.use(VueBananaI18n)
}

export default VueBananaI18n
