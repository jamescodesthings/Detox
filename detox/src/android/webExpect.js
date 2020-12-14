const invoke = require('../invoke');
const EspressoWebDetoxApi = require('./espressoapi/web/EspressoWebDetox');
const WebViewElementApi = require('./espressoapi/web/WebViewElement');
const WebElementApi = require('./espressoapi/web/WebElement');
const WebExpectElementApi = require('./espressoapi/web/WebExpectElement');
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
  constructor(invocationManager, action) {
    super(invocationManager);
    this._call = action._call;
  }
}

class WebAction {

}

class WebTapAction extends WebAction {
  constructor(element) {
    super();
    this._call = WebElementApi.tap(element._call);
  }
}

class WebReplaceTextAction extends WebAction {
  constructor(element, text) {
    super();
    this._call = WebElementApi.replaceText(element._call, text);
  }
}

class WebClearTextAction extends WebAction {
  constructor(element) {
    super();
    this._call = WebElementApi.clearText(element._call);
  }
}

class WebScrollToViewAction extends WebAction {
  constructor(element) {
    super();
    this._call = WebElementApi.scrollToView(element._call);
  }
}

class WebGetTextAction extends WebAction {
  constructor(element) {
    super();
    this._call = WebElementApi.getText(element._call);
  }
}

class WebRunScriptAction extends WebAction {
  constructor(element, script) {
    super();
    this._call = WebElementApi.runScript(element._call, script);
  }
}

class WebRunScriptWithArgsAction extends WebAction {
  constructor(element, script, args) {
    super();
    this._call = WebElementApi.runScriptWithArgs(element._call, script, args);
  }
}

class WebGetCurrentUrlAction extends WebAction {
  constructor(element) {
    super();
    this._call = WebElementApi.getCurrentUrl(element._call);
  }
}

class WebGetTitleAction extends WebAction {
  constructor(element) {
    super();
    this._call = WebElementApi.getTitle(element._call);
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
      this._call = invoke.callDirectly(EspressoWebDetoxApi.getWebView(matcher._call));
    }
    this._call = invoke.callDirectly(EspressoWebDetoxApi.getWebView());

    this.element = this.element.bind(this);
  }

  element(webMatcher, index = 0) {
    return new WebElement(this._invocationManager, this, webMatcher, index)
  }
}

class WebElement {
  constructor(invocationManager, webviewElement, matcher, index) {
    this._invocationManager = invocationManager;
    this._call = invoke.callDirectly(WebViewElementApi.element(call(webviewElement._call), matcher._call.value, index));
  }

  async tap() {
    return await new ActionInteraction(this._invocationManager, new WebTapAction(this)).execute();
  }

  async typeText(text) {
    
    // return await new ActionInteraction(this._invocationManager, new WebTypeTextAction(this, text)).execute();
  }

  async replaceText(text) {
    return await new ActionInteraction(this._invocationManager,  new WebReplaceTextAction(this, text)).execute();
  }

  async clearText() {
    return await new ActionInteraction(this._invocationManager,  new WebClearTextAction(this)).execute();
  }

  async scrollToView() {
    return await new ActionInteraction(this._invocationManager,  new WebScrollToViewAction(this)).execute();
  }

  async getText() {
    return await new ActionInteraction(this._invocationManager,  new WebGetTextAction(this)).execute();
  }

  async runScript(script) {
    return await new ActionInteraction(this._invocationManager,  new WebRunScriptAction(this, script)).execute();
  }

  async runScriptWithArgs(script, args) {
    return await new ActionInteraction(this._invocationManager,  new WebRunScriptWithArgsAction(this, script, args)).execute();
  }

  async getCurrentUrl() {
    return await new ActionInteraction(this._invocationManager,  new WebGetCurrentUrlAction(this)).execute();
  }

  async getTitle() {
    return await new ActionInteraction(this._invocationManager,  new WebGetTitleAction(this)).execute();
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