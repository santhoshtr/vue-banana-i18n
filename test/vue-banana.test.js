'use strict'
import { createI18n } from '../src'
import { watch, inject } from 'vue'
import { mount } from '@vue/test-utils'
import assert from 'assert'
import { describe, it, beforeEach } from 'vitest'

const translations = {
  en: {
    hello_world: 'Hello world',
    search_results: 'Found $1 {{PLURAL:$1|result|results}}',
    profile_change_message: '$1 changed {{GENDER:$2|his|her}} profile picture',
    hello_wikipedia: 'Hello [https://wikipedia.org wikipedia.org]',
    hello_wikipedia_unsafe: 'Hello [http://wikipedia.org <script>alert( "link-script test" );</script>]',
    'empty-results': 'No pages found for "$1" in $2'
  },
  ml: {
    hello_world: 'എല്ലാവർക്കും നമസ്കാരം',
    search_results: '{{PLURAL:$1|$1 ഫലം|$1 ഫലങ്ങൾ|1=ഒരു ഫലം}} കണ്ടെത്തി',
    profile_change_message: '$1 {{GENDER:$2|അവന്റെ|അവളുടെ}} പ്രൊഫൈൽ പടം മാറ്റി',
    hello_wikipedia: 'നമസ്കാരം [https://wikipedia.org wikipedia.org]'
  }
}

const Component = {
  template: `
    <p>{{$i18n(msg)}}</p>
  `,
  props: {
    msg: { type: String, default: 'hello_world' }
  }
}

const i18n = createI18n({
  messages: translations,
  locale: 'en',
  wikilinks: true
})

describe('Vue-Banana-i18n', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Component, {
      props: { msg: 'hello_world' },
      global: {
        plugins: [i18n]
      }
    })
  })
  it('will simply return the original string if no translation is found', () => {
    assert.strict.equal(wrapper.text(), 'Hello world')
  })
})

describe('v-i18n directive', () => {
  it('creates the v-i18n directive', () => {
    const wrapper = mount(Component, {
      props: { msg: 'hello_world' },
      global: {
        plugins: [i18n]
      }
    })
    console.dir(wrapper.vm.config)
    // assert.strict.equal(typeof wrapper.vm.$options.directives.i18n, 'object')
  })

  it('string literal should be translated as text', async () => {
    const wrapper = mount({
      template: '<p v-i18n="\'hello_world\'"></p>',
      props: {
        locale: { type: String, default: 'en' }
      },
      setup (props) {
        const setLocale = inject('setLocale')
        watch(() => props.locale, (newLocale, oldLocale) => setLocale(newLocale))
        return {}
      }
    }, {
      global: {
        plugins: [i18n]
      }
    })

    assert.strict.equal(wrapper.text(), 'Hello world')
    await wrapper.setProps({ locale: 'ml' })
    assert.strict.equal(wrapper.text(), 'എല്ലാവർക്കും നമസ്കാരം')
  })

  it('object should be translated', () => {
    let wrapper = mount({
      template: '<p v-i18n="{msg: \'search_results\', params:[10]}"></p>',
      setup (props) {
        const setLocale = inject('setLocale')
        setLocale('en')
      }
    }, {
      global: {
        plugins: [i18n]
      }
    })
    assert.strict.equal(wrapper.text(), 'Found 10 results')
    wrapper = mount({
      template: '<p v-i18n:search_results="[11]"></p>'
    }, {
      global: {
        plugins: [i18n]
      }
    })
    assert.strict.equal(wrapper.text(), 'Found 11 results')
  })

  it('message with multiple parameters should be translated', () => {
    const wrapper = mount({
      template: '<p v-i18n:empty-results="[\'Invalid page\', \'English\']" />',
      setup (props) {
        const setLocale = inject('setLocale')
        setLocale('en')
      }
    }, {
      global: {
        plugins: [i18n]
      }
    })
    assert.strict.equal(wrapper.text(), 'No pages found for "Invalid page" in English')
  })

  it('html should be escaped', () => {
    const wrapper = mount({
      template: '<p v-i18n:hello_wikipedia></p>'
    }, {
      global: {
        plugins: [i18n]
      }
    })
    assert.strict.equal(wrapper.text(), 'Hello <a href="https://wikipedia.org">wikipedia.org</a>')
    assert.strict.equal(wrapper.html(), '<p>Hello &lt;a href="https://wikipedia.org"&gt;wikipedia.org&lt;/a&gt;</p>')
  })

  it('reactive to params', async () => {
    let params = [10]
    const Component = {
      template: '<p v-i18n="{msg: \'search_results\', params}"></p>',
      props: ['params']
    }
    const wrapper = mount(Component, {
      props: { params },
      global: {
        plugins: [i18n]
      }
    })
    assert.strict.equal(wrapper.text(), 'Found 10 results')
    params = [11]
    await wrapper.setProps({ params })
    assert.strict.equal(wrapper.text(), 'Found 11 results')
  })
})

describe('v-i18n-html directive', () => {
  it('string literal should be translated as html', () => {
    const wrapper = mount({
      template: '<p v-i18n:hello_wikipedia.html></p>'
    }, {
      global: {
        plugins: [i18n]
      }
    })

    assert.strict.equal(wrapper.html(), '<p>Hello <a href="https://wikipedia.org">wikipedia.org</a></p>')
    assert.strict.equal(wrapper.find('a').attributes('href'), 'https://wikipedia.org')
  })

  it('Unsafe HTML should be escaped', () => {
    const wrapper = mount({
      template: '<p v-i18n:hello_wikipedia_unsafe.html></p>'
    }, {
      global: {
        plugins: [i18n]
      }
    })

    assert.strict.equal(wrapper.html(), '<p>Hello <a href="http://wikipedia.org">&lt;script&gt;alert( "link-script test" );&lt;/script&gt;</a></p>')
    assert.strict.notEqual(wrapper.find('a').attributes('href'), 'https://wikipedia.org')
  })
})
