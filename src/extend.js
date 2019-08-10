
export default function extend (Vue) {
  Vue.prototype.$i18n = function (msg, ...params) {
    return this.i18n.i18n(msg, ...params)
  }
}
