export function bind (el, binding, vnode, oldVnode) {
  localise(el, binding, vnode)
}

export function update (el, binding, vnode, oldVnode) {
  if (isMsgContextChanged(el, vnode)) {
    localise(el, binding, vnode)
  }
}

export function unbind (el, binding, vnode, oldVnode) {
  el._locale = undefined
  delete el['_locale']
}

function isMsgContextChanged (el, vnode) {
  if (!localeEqual(el, vnode)) {
    return true
  }
}

function localeEqual (el, vnode) {
  const vm = vnode.context
  return el._locale === vm.i18n.locale
}

function localise (el, binding, vnode) {
  const value = binding.value
  const vm = vnode.context
  const { msg, params, format } = parseValue(value)
  if (format === 'text') {
    el.textContent = vm.$i18n(msg, ...params)
  } else {
    el.innerHTML = vm.$i18n(msg, ...params)
  }
  el._locale = vm.i18n.locale
}

function parseValue (value) {
  let msg, locale, params, format

  if (typeof value === 'string') {
    msg = value
  } else if (value !== null && typeof value === 'object') {
    msg = value.msg
    params = value.params
    format = value.format || 'text'
  }
  params = params || []
  if (!Array.isArray(params)) {
    params = [params]
  }
  return { msg, locale, params, format }
}
