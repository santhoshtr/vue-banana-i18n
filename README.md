# vue-banana-i18n

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/santhoshtr/vue-banana-i18n/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/vue-banana-i18n.svg?style=flat)](https://www.npmjs.com/package/vue-banana-i18n) [![Build](https://github.com/santhoshtr/vue-banana-i18n/actions/workflows/node.js.yml/badge.svg)](https://github.com/santhoshtr/vue-banana-i18n/actions/workflows/node.js.yml)

A [banana-i18n](https://github.com/wikimedia/banana-i18n) wrapper to support localization in Vue.js

[Playground](https://codesandbox.io/s/vue3-banana-i18n-wpw5q)

> For Vue 2 use version 1.x. Version 2.x+ only supports Vue 3.x+

## Installation

```javascript
npm install vue-banana-i18n
```

then

```javascript
import i18n from 'vue-banana-i18n'
```

## Basic Usage

``` html
<div id="app">
  <h1>{{ $i18n('hello_world') }}</h1>
  <h2 class='result'>{{ $i18n('search_results', 10) }}</h2>
  <div class='status'>{{ $i18n('profile_change_message', 'Alice', 'female') }}</h2>
</div>

```

``` javascript
import { createApp } from "vue";
import App from "./App.vue";
import {createI18n} from 'vue-banana-i18n'

const messages = {
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

const app = createApp(App);
const i18nPlugin = createI18n({
  locale: "en",
  messages: messages
});

app.use(i18nPlugin);
app.mount("#app");
```

## Directive

The `v-i18n` directive as illustrated in below example is also useful. It sets the text for the node. HTML values if any, will be escaped.

``` html
<div id="app">
  <h1 v-i18n="'hello_world'"></h1>
  <h2 class='result' v-i18n="{msg: 'search_results', params:[10]}"></h2>
  <div class='status' v-i18n="{msg: 'profile_change_message', params:['Alice', 'female']}"></h2>
</div>

```

Alternative syntax:

``` html
<div id="app">
  <h1 v-i18n="'hello_world'"></h1>
  <h2 class='result' v-i18n:search_results="[10]"></h2>
  <div class='status' v-i18n:profile_change_message="['Alice', 'female']"></h2>
</div>

```

To set html of the node, use `v-i18n.html` or `v-i18n-html` directive just like above.

Example:

```html
  <h2 class='result' v-i18n:search_results.html="[10]"></h2>
```

## Message format

The Banana i18n system and its messages are documented at [banana-i18n](https://github.com/wikimedia/banana-i18n)

## License

[MIT](https://cos.mit-license.org/)
