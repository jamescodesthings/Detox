const invoke = require('../invoke');
const DetoxWebAssertion= require('./espressoapi/web/DetoxWebAssertion');
const DetoxWebActionsApi = require('./espressoapi/web/DetoxWebAtomAction');
const EspressoWebDetoxApi = require('./espressoapi/web/EspressoWebDetox');
const {
  IdMatcher
} = require('./webMatcher');

function call(maybeAFunction) {
  return maybeAFunction instanceof Function ? maybeAFunction() : maybeAFunction;
}

class WebInteraction {
  constructor(invocationManager) {
    this._call = undefined;
    this._invocationManager = invocationManager;
  }

  async execute() {
    const resultObj = await this._invocationManager.execute(this._call);
    return resultObj ? resultObj.result : undefined;
  }
}

class ActionInteraction extends WebInteraction {
  constructor(invocationManager, element, action) {
    super(invocationManager);
    this._call = EspressoWebDetoxApi.perform(call(element._call), action._call.value);
  }
}

class WebAction {
}

class WebTapAction extends WebAction {
  constructor() {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.click());
  }
}

class WebTypeTextAction extends WebAction {
  constructor(text) {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.typeText(text));
  }
}

class WebReplaceTextAction extends WebAction {
  constructor(text) {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.replaceText(text));
  }
}

class WebClearTextAction extends WebAction {
  constructor() {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.clearText());
  }
}

class WebScrollToViewAction extends WebAction {
  constructor() {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.scrollToView());
  }
}

class WebGetTextAction extends WebAction {
  constructor() {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.getText());
  }
}

class WebRunScriptAction extends WebAction {
  constructor(script) {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.runScript(script));
  }
}

class WebRunScriptWithArgsAction extends WebAction {
  constructor(script, args) {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.runScriptWithArgs(script, args));
  }
}

class WebGetCurrentUrlAction extends WebAction {
  constructor(script, args) {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.getCurrentUrl());
  }
}

class WebGetTitleAction extends WebAction {
  constructor() {
    super();
    this._call = invoke.callDirectly(DetoxWebActionsApi.getTitle());
  }
}

// class WebAssertionInteraction extends WebInteraction {
//   constructor(invocationManager, element, assertion) {
//     super(invocationManager);
//     this._call = EspressoWebDetoxApi.check(call(element._call), assertion._call.value);
//   }
// }

// class WebHasTextAssertion extends WebAction {
//   constructor(text) {
//     super();
//     this._call = invoke.callDirectly(DetoxWebAssertion.assertHasText(text));
//   }
// }

// class WebExistsAssertion extends WebAction {
//   constructor() {
//     super();
//     this._call = invoke.callDirectly(DetoxWebAssertion.assertExists());
//   }
// }


class WebViewElement {
  constructor(invocationManager, emitter, matcher) {
    this._invocationManager = invocationManager;
    this._emitter = emitter;
    if (matcher !== undefined) {
      this._call = invoke.call(invoke.EspressoWeb, 'onWebView', matcher._call);
    }
    this._call = invoke.call(invoke.EspressoWeb, 'onWebView');

    this.element = this.element.bind(this);
  }

  element(webMatcher) {
    return new WebElement(this._invocationManager, this, webMatcher)
  }
}

class WebElement {
  constructor(invocationManager, webViewElement, matcher) {
    this._invocationManager = invocationManager;
    this._call = EspressoWebDetoxApi.withElement(call(webViewElement._call), matcher._call.value);
  }

  async tap() {
    return await new ActionInteraction(this._invocationManager, this, new WebTapAction()).execute();
  }

  async typeText(text) {
    return await new ActionInteraction(this._invocationManager, this, new WebTypeTextAction(text)).execute();
  }

  async replaceText(text) {
    return await new ActionInteraction(this._invocationManager, this, new WebReplaceTextAction(text)).execute();
  }

  async clearText() {
    return await new ActionInteraction(this._invocationManager, this, new WebClearTextAction()).execute();
  }

  async scrollToView() {
    return await new ActionInteraction(this._invocationManager, this, new WebScrollToViewAction()).execute();
  }

  async getText() {
    return await new ActionInteraction(this._invocationManager, this, new WebGetTextAction()).execute();
  }

  async runScript(script) {
    return await new ActionInteraction(this._invocationManager, this, new WebRunScriptAction(script)).execute();
  }

  async runScriptWithArgs(script, args) {
    return await new ActionInteraction(this._invocationManager, this, new WebRunScriptWithArgsAction(script, args)).execute();
  }

  async getCurrentUrl() {
    return await new ActionInteraction(this._invocationManager, this, new WebGetCurrentUrlAction()).execute();
  }

  async getTitle() {
    return await new ActionInteraction(this._invocationManager, this, new WebGetTitleAction()).execute();
  }
}

class WebExpect {
  constructor(invocationManager) {
    this._invocationManager = invocationManager;
  }

  get not() {
    this._notCondition = true;
    return this;
  }
}

class WebExpectElement extends WebExpect {
  constructor(invocationManager, element) {
    super(invocationManager);
    this._element = element;
  }

  // async toHaveText(text) {
  //   return await new WebAssertionInteraction(this._invocationManager, this._element, new WebHasTextAssertion(text)).execute();
  // }

  // async toExists() {
  //   return await new WebAssertionInteraction(this._invocationManager, this._element, new WebExistsAssertion()).execute();
  // }
}

class WaitFor {
  constructor(invocationManager) {
    this._invocationManager = invocationManager;
  }
}

class AndroidWebExpect {
  constructor({ invocationManager, emitter }) {
    this._invocationManager = invocationManager;
    this._emitter = emitter;

    this.by = {
      id: value => new IdMatcher(value),
    };

    this.getWebView = this.getWebView.bind(this);
    this.expect = this.expect.bind(this);
    // this.waitFor = this.waitFor.bind(this);
  }

  async getWebView(webViewMatcher) {
    return new WebViewElement(this._invocationManager, this._emitter, webViewMatcher);
  }

  expect(webElement) {
    return new WebExpectElement(this._invocationManager, webElement)
  }
}

module.exports = AndroidWebExpect;