Voxa Opearlo
===========

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