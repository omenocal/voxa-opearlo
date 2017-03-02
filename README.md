Voxa Opearlo
===========

A [Opearlo](https://www.npmjs.com/package/opearlo-analytics) plugin for [voxa](https://mediarain.github.io/voxa/)

Installation
-------------

Just install from [npm](https://www.npmjs.com/package/voxa-opearlo)

```bash
npm install --save voxa-opearlo
```

Usage
------

```javascript

const opearloConfig = {
	opearloUserId: 'opearlo-user-id',
	opearloAppName: 'opearlo-app-name',
};

const skill = require('voxa');
const voxaOpearlo = require('voxa-opearlo');

voxaOpearlo(skill, opearloConfig)

```