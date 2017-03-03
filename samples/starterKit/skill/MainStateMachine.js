'use strict';

// Include the state machine module and the replyWith function
const Voxa = require('voxa');
const views = require('./views');
const variables = require('./variables');
const states = require('./states');
const voxaOpearlo = require('voxa-opearlo');
const config = require('../config');

const skill = new Voxa({ variables, views });

states.register(skill);
voxaOpearlo(skill, config.opearlo);

module.exports = skill;
