'use strict';

// Include the state machine module and the replyWith function
const Voxa = require('voxa');
const views = require('./views');
const variables = require('./variables');
const states = require('./states');
const voxaOpearlo = require('voxa-opearlo');

const opearloConfig = {
  userId: 'tkT8PClpPxMOvPbadGyzOoJKwoX2',
  appName: 'test',
  apiKey: 'zgbapwBh8J1FeJ7NeFHe28tSznTuqoPG2qtJRZvE',
};

const skill = new Voxa({ variables, views });

states.register(skill);
voxaOpearlo(skill, opearloConfig);

module.exports = skill;
