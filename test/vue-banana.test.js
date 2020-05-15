'use strict'
import VueBananai18n from '../src'
import Vue from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import assert from 'assert'

const translations = {
  en: {
    'hello_world': 'Hello world',
    'search_results': 'Found $1 {{PLURAL:$1|result|results}}',
    'profile_change_message': '$1 changed {{GENDER:$2|his|her}} profile picture',
    'hello_wikipedia': 'Hello [https://wikipedia.org wikipedia.org]'
  },
  ml: {
    'hello_world': 'എല്ലാവർക്കും നമസ്കാരം',
    'search_results': '{{PLURAL:$1|$1 ഫലം|$1 ഫലങ്ങൾ|1=ഒരു ഫലം}} കണ്ടെത്തി',
    'profile_change_message': '$1 {{GENDER:$2|അവന്റെ|അവളുടെ}} പ്രൊഫൈൽ പടം മാറ്റി',
    'hello_wikipedia': 'നമസ്കാരം [https://wikipedia.org wikipedia.org]'
  }
}

Vue.use(VueBananai18n, {
  messages: translations,
  locale: 'en'
})

const Component = {
  template: `
    <p>{{$i18n(msg)}}</p>
  `,
  props: {
    'msg': { type: String, default: 'hello_world' }
  }
}

describe('Vue-Banana-i18n', () => {
  let wrapper
  let vm
  beforeEach(() => {
    wrapper = mount(Component, { propsData: { msg: 'hello_world' } })
    vm = wrapper.vm
  })
  it('will simply return the original string if no translation is found', () => {
    assert.strict.equal(wrapper.text(), 'Hello world')
    vm.i18n.locale = 'DNE'
    assert.strict.equal(wrapper.text(), 'Hello world')
  })

  it('will return the translation with placeholder substitutions', () => {
    vm.i18n.locale = 'en'
    assert.strict.equal(vm.$i18n('search_results', 0), 'Found 0 results')
    assert.strict.equal(vm.$i18n('search_results', 1), 'Found 1 result')
    assert.strict.equal(vm.$i18n('search_results', 10), 'Found 10 results')
    assert.strict.equal(
      vm.$i18n('profile_change_message', 'Alice', 'female'),
      'Alice changed her profile picture'
    )
    assert.strict.equal(
      vm.$i18n('profile_change_message', 'Bob', 'male'),
      'Bob changed his profile picture'
    )
  })

  it('will return the translation in correct locale when locale changed in between', () => {
    vm.i18n.locale = 'en'
    assert.strict.equal(vm.$i18n('search_results', 1), 'Found 1 result')
    assert.strict.equal(vm.$i18n('search_results', 10), 'Found 10 results')
    assert.strict.equal(
      vm.$i18n('profile_change_message', 'Alice', 'female'),
      'Alice changed her profile picture'
    )
    assert.strict.equal(
      vm.$i18n('profile_change_message', 'Bob', 'male'),
      'Bob changed his profile picture'
    )

    vm.i18n.locale = 'ml'
    assert.strict.equal(vm.$i18n('search_results', 1), 'ഒരു ഫലം കണ്ടെത്തി')
    assert.strict.equal(vm.$i18n('search_results', 10), '10 ഫലങ്ങൾ കണ്ടെത്തി')
    assert.strict.equal(
      vm.$i18n('profile_change_message', 'Alice', 'female'),
      'Alice അവളുടെ പ്രൊഫൈൽ പടം മാറ്റി'
    )
    assert.strict.equal(
      vm.$i18n('profile_change_message', 'Bob', 'male'),
      'Bob അവന്റെ പ്രൊഫൈൽ പടം മാറ്റി'
    )
  })

  it('will fallback to another locale if message is not present', () => {
    vm.i18n.locale = 'en'
    vm.i18n.loadMessages({
      'new_mssage': 'New message'
    }, 'en')
    vm.i18n.locale = 'ml'
    assert.strict.equal(vm.$i18n('new_mssage'), 'New message', 'Fallback to English')
  })

  it('will re-render if locale changed', async () => {
    assert.strict.equal(wrapper.text(), 'Hello world')
    vm.i18n.locale = 'ml'
    await Vue.nextTick()
    assert.strict.equal(wrapper.text(), 'എല്ലാവർക്കും നമസ്കാരം')
  })
})

describe('Vue-Banana-i18n global mixin', () => {
  let wrapper
  let vm
  beforeEach(() => {
    wrapper = shallowMount(Component, {
      i18n: new VueBananai18n({
        messages: translations,
        locale: 'en'
      }),
      propsData: { msg: 'hello_world' } })
    vm = wrapper.vm
  })
  it('will simply return the original string if no translation is found', () => {
    assert.strict.equal(wrapper.text(), 'Hello world')
    vm.i18n.locale = 'DNE'
    assert.strict.equal(wrapper.text(), 'Hello world')
  })
})

describe('v-i18n directive', () => {
  it('creates the v-i18n directive', () => {
    const wrapper = mount(Component, { propsData: { msg: 'hello_world' } })
    assert.strict.equal(typeof wrapper.vm.$options.directives['i18n'], 'object')
  })

  it('string literal should be translated as text', async () => {
    const wrapper = mount({
      template: `<p v-i18n="'hello_world'"></p>`
    })

    assert.strict.equal(wrapper.text(), 'Hello world')
    wrapper.vm.i18n.locale = 'ml'
    await Vue.nextTick()
    assert.strict.equal(wrapper.text(), 'എല്ലാവർക്കും നമസ്കാരം')
  })

  it('object should be translated', () => {
    let wrapper = mount({
      template: `<p v-i18n="{msg: 'search_results', params:[10]}"></p>`
    })
    assert.strict.equal(wrapper.text(), 'Found 10 results')
    wrapper = mount({
      template: `<p v-i18n:search_results="[11]"></p>`
    })
    assert.strict.equal(wrapper.text(), 'Found 11 results')
  })

  it('html should be escaped', () => {
    const wrapper = mount({
      template: `<p v-i18n="'hello_wikipedia'"></p>`
    })
    assert.strict.equal(wrapper.text(), 'Hello <a href="https://wikipedia.org">wikipedia.org</a>')
    assert.strict.equal(wrapper.html(), '<p>Hello &lt;a href="https://wikipedia.org"&gt;wikipedia.org&lt;/a&gt;</p>')
  })
})

describe('v-i18n-html directive', () => {
  it('creates the v-i18n-html directive', () => {
    const wrapper = mount(Component, { propsData: { msg: 'hello_world' } })
    assert.strict.equal(typeof wrapper.vm.$options.directives['i18n-html'], 'object')
  })

  it('string literal should be translated as html', () => {
    const wrapper = mount({
      template: `<p v-i18n-html="'hello_wikipedia'"></p>`
    })

    assert.strict.equal(wrapper.html(), '<p>Hello <a href="https://wikipedia.org">wikipedia.org</a></p>')
    assert.strict.equal(wrapper.find('a').attributes('href'), 'https://wikipedia.org')
  })
})
