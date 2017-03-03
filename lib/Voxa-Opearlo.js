'use strict';

const _ = require('lodash');
const OpearloAnalytics = require('opearlo-analytics');
const debug = require('debug')('voxa:opearlo');

const defaultConfig = {
  initialState: 'entry',
  userId: 'userId',
  appName: 'appName',
  apiKey: 'apiKey',
};

function register(skill, config) {
  const pluginConfig = _.merge({}, defaultConfig, config);

  skill.onSessionStarted((alexaEvent) => {
    OpearloAnalytics.initializeAnalytics(
      pluginConfig.userId,
      pluginConfig.appName,
      alexaEvent.session);

    debug('Session started');
  });

  skill.onIntentRequest((alexaEvent, reply) => {
    OpearloAnalytics.registerVoiceEvent(
      alexaEvent.session.user.userId,
      'IntentRequest',
      alexaEvent.intent);

    debug(`${alexaEvent.intent.name} registered`);
  });

  skill.onAfterStateChanged((alexaEvent, reply, transition) => {
    if (transition) {
      OpearloAnalytics.registerVoiceEvent(
        alexaEvent.session.user.userId,
        'Custom',
        'State transition',
        { to: transition.to });

      debug(`${transition.to} state registered`);
    }
  });

  skill.onBeforeReplySent((alexaEvent, reply, transition) => new Promise((resolve, reject) => {
    OpearloAnalytics.recordAnalytics(
      alexaEvent.session.user.userId,
      pluginConfig.apiKey,
      (result) => {
        debug(`recordAnalytics (state: ${transition.to.name}); result: ${result}`);
        resolve();
      });
  }));

  skill.onSessionEnded((alexaEvent) => {
    OpearloAnalytics.registerVoiceEvent(alexaEvent.session.user.userId,
      'Custom',
      'Session ended');
    debug('SessionEndedRequest registered');
  });

  skill.onStateMachineError((alexaEvent, reply, error) => {
    OpearloAnalytics.registerVoiceEvent(alexaEvent.session.user.userId,
      'Custom',
      'Error',
      { message: error.message });

    debug(`Error registered: ${error}`);
  });
}

module.exports = register;
