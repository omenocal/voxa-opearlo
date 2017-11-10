'use strict';

const chai = require('chai');
const OpearloAnalytics = require('opearlo-analytics');

const simple = require('simple-mock');

const expect = chai.expect;
const Voxa = require('voxa');
const voxaOpearlo = require('../lib/Voxa-Opearlo');
const views = require('./views');

describe('Voxa-Opearlo plugin', () => {
  let voxaStateMachine;
  const opearloConfig = {
    userId: 'userId',
    appName: 'appName',
    apiKey: 'apiKey',
  };

  beforeEach(() => {
    voxaStateMachine = new Voxa({ views });
    simple.mock(OpearloAnalytics, 'recordAnalytics').callbackWith('MOCK TRACKED');
    simple.mock(OpearloAnalytics, 'registerVoiceEvent').returnWith('MOCK TRACKED');
  });

  afterEach(function(){
    simple.restore();
  })

  it('should register Opearlo analytics on LaunchRequest', () => {
    const spy = simple.spy(() => ({ reply: 'LaunchIntent.OpenResponse', to: 'entry' }));
    voxaStateMachine.onIntent('LaunchIntent', spy);

    const event = {
      request: {
        type: 'LaunchRequest',
      },
      session: {
        new: true,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(reply.session.new).to.equal(true);
        expect(reply.session.attributes.state).to.equal('entry');
        expect(reply.msg.statements).to.have.lengthOf(1);
        expect(reply.msg.statements[0]).to.equal('Hello! How are you?');
        expect(OpearloAnalytics.registerVoiceEvent.called).to.be.true;
        expect(OpearloAnalytics.registerVoiceEvent.calls[0].args[0]).to.equal('user-id')
        expect(OpearloAnalytics.registerVoiceEvent.calls[0].args[1]).to.equal('IntentRequest')
      });
  });

  it('should register state information', () => {
    const spy = simple.spy(() => ({ reply: 'LaunchIntent.OpenResponse', to: 'entry' }));
    voxaStateMachine.onIntent('LaunchIntent', spy);

    const event = {
      request: {
        type: 'LaunchRequest',
      },
      session: {
        new: true,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(reply.session.new).to.equal(true);
        expect(reply.session.attributes.state).to.equal('entry');
        expect(reply.msg.statements).to.have.lengthOf(1);
        expect(reply.msg.statements[0]).to.equal('Hello! How are you?');
        expect(OpearloAnalytics.registerVoiceEvent.called).to.be.true;
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[0]).to.equal('user-id')
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[1]).to.equal('Custom')
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[2]).to.equal('LaunchIntent')
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[3].reply).to.equal('LaunchIntent.OpenResponse')
      });
  })

  it('should register states that don\'t have a reply', () => {
    const spy = simple.spy(() => ({ to: 'die' }));
    voxaStateMachine.onIntent('LaunchIntent', spy);

    const event = {
      request: {
        type: 'LaunchRequest',
      },
      session: {
        new: true,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(OpearloAnalytics.registerVoiceEvent.called).to.be.true;
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[0]).to.equal('user-id')
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[1]).to.equal('Custom')
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[2]).to.equal('LaunchIntent')
        expect(OpearloAnalytics.registerVoiceEvent.calls[1].args[3].reply).to.be.undefined;
      });
  })

  it('should register Opearlo analytics on IntentRequest', () => {
    const spy = simple.spy(() => ({ reply: 'Question.Ask', to: 'entry' }));
    voxaStateMachine.onIntent('SomeIntent', spy);

    const event = {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SomeIntent',
        },
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(reply.session.new).to.equal(false);
        expect(reply.session.attributes.state).to.equal('entry');
        expect(reply.msg.statements).to.have.lengthOf(1);
        expect(reply.msg.statements[0]).to.equal('What time is it?');
      });
  });

  it('should register Opearlo analytics on IntentRequest and end the session', () => {
    const spy = simple.spy(() => ({ reply: 'ExitIntent.GeneralExit', to: 'die' }));
    voxaStateMachine.onIntent('ExitIntent', spy);

    const event = {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'ExitIntent',
        },
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(reply.session.new).to.equal(false);
        expect(reply.session.attributes.state).to.equal('die');
        expect(reply.msg.statements).to.have.lengthOf(1);
        expect(reply.msg.statements[0]).to.equal('Ok. Goodbye.');
      });
  });

  it('should not register Opearlo analytics on IntentRequest with an invalid state', () => {
    const spy = simple.spy(() => ({ reply: 'ExitIntent.GeneralExit', to: 'die' }));
    voxaStateMachine.onState('ExitIntent', spy);

    const event = {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'ExitIntent',
        },
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.false;
        expect(reply.session.new).to.equal(false);
        expect(reply.session.attributes).to.be.undefined;
        expect(reply.msg.statements).to.have.lengthOf(1);
        expect(reply.msg.statements[0]).to.equal('An unrecoverable error occurred.');
      });
  });


  it('should register Opearlo analytics on SessionEndedRequest', () => {
    const spy = simple.spy(() => ({ reply: 'ExitIntent.GeneralExit' }));
    voxaStateMachine.onSessionEnded(spy);

    const event = {
      request: {
        type: 'SessionEndedRequest',
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(reply.version).to.equal('1.0');
        expect(OpearloAnalytics.recordAnalytics.called).to.be.true;
      });
  });

  it('should register Opearlo analytics on unexpected error', () => {
    const intentSpy = simple.spy(() => {
      throw new Error('random error');
    });
    voxaStateMachine.onIntent('ErrorIntent', intentSpy);

    const spy = simple.spy(() => ({ reply: 'BadInput.RepeatLastAskReprompt', to: 'invalid-state' }));
    voxaStateMachine.onError(spy);

    const event = {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'ErrorIntent',
        },
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, opearloConfig);
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(spy.called).to.be.true;
        expect(reply.reply).to.equal('BadInput.RepeatLastAskReprompt');
        expect(reply.to).to.equal('invalid-state');
        expect(reply.error.toString()).to.equal('Error: random error');
      });
  });

  it('should not record analytics if the user is ignored', () => {
    const spy = simple.spy(() => ({ reply: 'ExitIntent.GeneralExit' }));
    voxaStateMachine.onSessionEnded(spy);

    const event = {
      request: {
        type: 'SessionEndedRequest',
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, Object.assign({ignoreUsers: ['user-id']},opearloConfig));
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(OpearloAnalytics.recordAnalytics.called).to.not.be.true;
      });
  });

   it('should record sessions terminated due to errors as an error', () => {
    const spy = simple.spy(() => ({ reply: 'ExitIntent.GeneralExit' }));
    voxaStateMachine.onSessionEnded(spy);

    const event = {
      request: {
        type: 'SessionEndedRequest',
        reason: 'ERROR',
        error: {
          message: 'my message'
        }
      },
      session: {
        new: false,
        application: {
          applicationId: 'appId',
        },
        user: {
          userId: 'user-id',
        },
      },
    };

    voxaOpearlo(voxaStateMachine, Object.assign({ignoreUsers: ['user-id']},opearloConfig));
    return voxaStateMachine.execute(event)
      .then((reply) => {
        expect(OpearloAnalytics.registerVoiceEvent.lastCall.args[2]).to.equal('Error');
      });
  });

});
