Voxa Opearlo
===========

[![Build Status](https://travis-ci.org/mediarain/voxa-opearlo.svg?branch=master)](https://travis-ci.org/mediarain/voxa-opearlo)
[![Coverage Status](https://coveralls.io/repos/github/mediarain/voxa-opearlo/badge.svg?branch=master)](https://coveralls.io/github/mediarain/voxa-opearlo?branch=master)

An [Opearlo](https://www.npmjs.com/package/opearlo-analytics) plugin for [voxa](https://mediarain.github.io/voxa/)

Installation
-------------

Just install from [npm](https://www.npmjs.com/package/voxa-opearlo)

```bash
npm install --save voxa-opearlo
```

Usage
------

```javascript

const voxaOpearlo = require('voxa-opearlo');

const opearloConfig = {
  userId: 'userId',
  appName: 'appName',
  apiKey: 'apiKey',
};

voxaOpearlo(skill, opearloConfig);

```