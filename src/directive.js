export function bindText (el, binding, vnode) {
  const { msg, params } = parseValue(binding)
  const vm = vnode.context
  el.textContent = vm.$i18n(msg, ...params)
  el._locale = vm.i18n.locale
}

export function bindHtml (el, binding, vnode) {
  const { msg, params } = parseValue(binding)
  const vm = vnode.context
  el.innerHTML = vm.$i18n(msg, ...params)
  el._locale = vm.i18n.locale
}

export function updateText (el, binding, vnode) {
  if (isMsgContextChanged(el, vnode)) {
    bindText(el, binding, vnode)
  }
}

export function updateHtml (el, binding, vnode) {
  if (isMsgContextChanged(el, vnode)) {
    bindHtml(el, binding, vnode)
  }
}

export function unbind (el, binding, vnode) {
  el._locale = undefined
  delete el['_locale']
}

function isMsgContextChanged (el, vnode) {
  if (el._locale !== vnode.context.i18n.locale) {
    return true
  }
}

function parseValue (binding) {
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
