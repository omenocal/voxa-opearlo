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

  skill.onAfterStateChanged((alexaEvent, reply, transition) => {
    OpearloAnalytics.registerVoiceEvent(
      alexaEvent.session.user.userId,
      'Custom',
      alexaEvent.intent.name,
      _.merge({ to: transition.to }, alexaEvent.intent.params));

    debug(`${transition.to} registered`);
  });

  skill.onBeforeReplySent((alexaEvent, reply, transition) => new Promise((resolve, reject) => {
    OpearloAnalytics.recordAnalytics(
      alexaEvent.session.user.userId,
      pluginConfig.apiKey,
      (result) => {
        debug(`recordAnalytics (state: ${transition.to}); result: ${result}`);
        resolve();
      });
  }));

  skill.onSessionEnded((alexaEvent) => {
    OpearloAnalytics.registerVoiceEvent(alexaEvent.session.user.userId, 'SessionEndedRequest', 'die');
    debug('SessionEndedRequest registered');
  });

  skill.onStateMachineError((alexaEvent, reply, error) => {
    OpearloAnalytics.registerVoiceEvent(alexaEvent.session.user.userId,
      'error',
      alexaEvent.intent.name,
      alexaEvent.intent.params);

    debug(`Error registered: ${error}`);
  });
}

module.exports = register;
