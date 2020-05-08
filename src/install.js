import extend from './extend'
import { bindText, bindHtml, updateHtml, updateText, unbind } from './directive'
import VueBananaI18n from './index'

export let Vue

export function install (_Vue, options = { messages: {}, locale: 'en' }) {
  if (install.installed && _Vue === Vue) return
  install.installed = true
  Vue = _Vue

  Vue.mixin({
    beforeCreate () {
      if (this.$options.i18n) {
        this._bananaRoot = this
        this.i18n = this.$options.banana
        this.i18n.init(this)
        Vue.util.defineReactive(this, 'i18n', this.i18n)
      } else {
        this.i18n = new VueBananaI18n(options)
        this.i18n.init()
        this.$options.i18n = this.i18n
        this._bananaRoot = (this.$parent && this.$parent._bananaRoot) || this
        Vue.util.defineReactive(this, 'i18n', this.i18n)
      }
    },
    destroyed () {
    }
  })

  extend(Vue)
  Vue.directive('i18n', { bind: bindText, update: updateText, unbind })
  Vue.directive('i18n-html', { bind: bindHtml, update: updateHtml, unbind })
}
