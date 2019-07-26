'use strict'

import VueBananai18n from '../src'
import Vue from 'vue'
import assert from 'assert'

const translations = {
  en: {
    'hello_world': 'Hello world',
    'search_results': 'Found $1 {{PLURAL:$1|result|results}}',
    'profile_change_message': '$1 changed {{GENDER:$2|his|her}} profile picture'
  },
  ml: {
    'hello_world': 'എല്ലാവർക്കും നമസ്കാരം',
    'search_results': '{{PLURAL:$1|$1 ഫലം|$1 ഫലങ്ങൾ|1=ഒരു ഫലം}} കണ്ടെത്തി',
    'profile_change_message': '$1 {{GENDER:$2|അവന്റെ|അവളുടെ}} പ്രൊഫൈൽ പടം മാറ്റി'
  }
}

Vue.use(VueBananai18n, {
  messages: translations,
  locale: 'en'
})

describe('Vue-Banana-i18n', () => {
  it('will simply return the original string if no translation is found', () => {
    let vm = new Vue()

    assert.strict.equal(vm.$i18n('hello_world'), 'Hello world')

    vm.i18n.locale = 'DNE'
    assert.strict.equal(vm.$i18n('msg_key_dne'), 'msg_key_dne')
  })

  it('will return the translation with placeholder substitutions', () => {
    let vm = new Vue()

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
    let vm = new Vue()

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
    let vm = new Vue()

    vm.i18n.locale = 'en'

    vm.i18n.loadMessages({
      'new_mssage': 'New message'
    }, 'en')
    vm.i18n.locale = 'ml'
    assert.strict.equal(vm.$i18n('new_mssage'), 'New message', 'Fallback to English')
  })

  it('will re-render if locale changed', (done) => {
    const vm = new Vue({
      render (h) {
        // <p ref="text">{{$i18n('hello_world')}}</p>
        return h('p', {
          ref: 'text'
        },
        [this.$i18n('hello_world')]
        )
      }
    }).$mount()

    vm.$nextTick(() => {
      assert.strictEqual(vm.$refs.text.textContent, 'Hello world')
      vm.i18n.locale = 'ml'
      vm.$nextTick(() => {
        assert.strictEqual(vm.$refs.text.textContent, 'എല്ലാവർക്കും നമസ്കാരം', 'reactivity works')
        done()
      })
    })
  })
})

describe('v-i18n directive', () => {
  afterEach(() => {
    let vm = new Vue()
    vm.i18n.locale = 'en'
  })

  it('creates the v-i18n directive', () => {
    let vm = new Vue()

    assert.strict.equal(typeof vm.$options.directives['i18n'], 'object')
  })

  it('string literal should be translated', done => {
    const vm = new Vue({
      render (h) {
        // <p ref="text" v-i18n="'hello_world'"></p>
        return h('p', { ref: 'text',
          directives: [{
            name: 'i18n', rawName: 'v-i18n', value: ('hello_world'), expression: "'hello_world'"
          }] })
      }
    }).$mount()

    vm.$nextTick(() => {
      assert.strictEqual(vm.$refs.text.textContent, 'Hello world')
      vm.i18n.locale = 'ml'
      vm.$nextTick(() => {
        assert.strictEqual(vm.$refs.text.textContent, 'എല്ലാവർക്കും നമസ്കാരം', 'reactivity works')
        done()
      })
    })
  })

  it('object should be translated', done => {
    const vm = new Vue({
      render (h) {
        // <p ref="text" v-i18n="{msg: 'search_results', params:[10]}"></p>
        return h('p', { ref: 'text',
          directives: [{
            name: 'i18n',
            rawName: 'v-i18n',
            value: ({ msg: 'search_results', params: [10] }),
            expression: "{msg: 'search_results', params:[10]}"
          }] })
      }
    }).$mount()

    vm.$nextTick(() => {
      assert.strictEqual(vm.$refs.text.textContent, 'Found 10 results')
      done()
    })
  })
})
