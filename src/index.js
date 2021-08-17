import Banana from 'banana-i18n'
import { reactive } from 'vue'
const parseValue = (binding) => {
  let msg, params

  if (Array.isArray(binding.value)) {
    // v-i18n-html:messageKey="[ ...params ]"
    msg = binding.arg
    params = binding.value
  } else if (binding.value !== null && typeof binding.value === 'object') {
    // v-i18n="{msg: messageKey, params:[param1, param2]}"
    msg = binding.value.msg
    params = binding.value.params
  } else {
    msg = binding.arg || binding.value
  }

  params = params || []

  if (!Array.isArray(params)) {
    params = [params]
  }

  if (!msg) {
    throw new Error(`${binding.rawName} used with parameter array but without message key`)
  }

  return { msg, params }
}

export default {
  install: (app, options = { messages: {}, locale: 'en' }) => {
    let bananai18n
    app.mixin({
      beforeCreate () {
        // Create a reactive i18n instance so that locales can be
        // changed on the go.
        bananai18n = reactive(new Banana(options.locale, options))
      }
    })

    app.config.globalProperties.$i18n = (msg, params) => {
      return bananai18n.i18n(msg, params)
    }

    app.provide('setLocale', (newLocale) => {
      bananai18n.setLocale(newLocale)
    })

    app.directive('i18n', (el, binding) => {
      // this will be called as `mounted` and `updated`
      const { msg, params } = parseValue(binding)
      if (binding.modifiers.html) {
        // v-i18n.html or v-i18n:message_key.html
        el.innerHTML = bananai18n.i18n(msg, params)
      } else {
        el.textContent = bananai18n.i18n(msg, params)
      }
    })

    app.directive('i18n-html', (el, binding) => {
      const { msg, params } = parseValue(binding)
      // The content is sanitized HTML, hence innerHTML is safe.
      el.innerHTML = bananai18n.i18n(msg, params)
    })
  }
}
