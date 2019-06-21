'use strict'

import VueBananai18n from '../src/main'
import Vue from 'vue'
import assert from 'assert'

const translations = {
  en: {
    'hello_world': 'Hello world',
    'search_results': 'Found $1 {{PLURAL:$1|result|results}}',
    'profile_change_message': '$1 changed {{GENDER:$2|his|her}} profile picture'
  }
}

Vue.use(VueBananai18n, translations)

describe('Vue-Banana-i18n', () => {
  it('will simply return the original string if no translation is found', () => {
    let vm = new Vue()

    assert.strict.equal(vm.$i18n('hello_world'), 'Hello world')

    vm.$root.locale = 'DNE'
    assert.strict.equal(vm.$i18n('msg_key_dne'), 'msg_key_dne')
  })

  it('will return the translation with placeholder substitutions', () => {
    let vm = new Vue()

    vm.$root.locale = 'en'
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
})
