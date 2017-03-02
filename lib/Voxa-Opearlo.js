'use strict';

const _ = require('lodash');
const OpearloAnalytics = require('opearlo-analytics');
const debug = require('debug')('voxa:opearlo');

const defaultConfig = {
  initialState: 'entry',
  opearloUserId: 'opearlo-user-id',
  opearloAppName: 'opearlo-app-name',
  opearloApiKey: 'opearlo-api-key',
};

function register(skill, config) {
  const pluginConfig = _.merge({}, defaultConfig, config);

  skill.onSessionStarted((alexaEvent) => {
    OpearloAnalytics.initializeAnalytics(
      pluginConfig.opearloUserId,
      pluginConfig.opearloAppName,
      alexaEvent.session);

    debug('Session started');
  });

  skill.onAfterStateChanged((alexaEvent, reply, transition) => {
    OpearloAnalytics.registerVoiceEvent(
      alexaEvent.session.user.userId,
      transition.to,
      alexaEvent.intent.name,
      alexaEvent.intent.params);

    alexaEvent.opearloRegistered = true;
    debug(`${transition.to} registered`);
  });

  skill.onBeforeReplySent((alexaEvent, reply, transition) => new Promise((resolve, reject) => {
    OpearloAnalytics.recordAnalytics(
      alexaEvent.session.user.userId,
      pluginConfig.opearloApiKey,
      (result) => {
        debug(`recordAnalytics (state: ${transition.to}); result: ${result}`);
        resolve();
      });
  }));

  skill.onSessionEnded((alexaEvent) => {
    OpearloAnalytics.registerVoiceEvent(alexaEvent.session.user.userId, 'die', 'SessionEndedRequest');
    alexaEvent.opearloRegistered = true;
    debug('SessionEndedRequest registered');
  });

  skill.onStateMachineError((alexaEvent, reply, error) => {
    OpearloAnalytics.registerVoiceEvent(alexaEvent.session.user.userId,
      'error',
      alexaEvent.intent.name,
      alexaEvent.intent.params);

    alexaEvent.opearloRegistered = true;
    debug(`Error registered: ${error}`);
  });
}

module.exports = register;
