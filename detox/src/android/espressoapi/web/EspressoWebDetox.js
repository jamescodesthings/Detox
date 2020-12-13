/**

	This code is generated.
	For more information see generation/README.md.
*/


function sanitize_matcher(matcher) {
  if (!matcher._call) {
    return matcher;
  }

  const originalMatcher = typeof matcher._call === 'function' ? matcher._call() : matcher._call;
  return originalMatcher.type ? originalMatcher.value : originalMatcher;
}
class EspressoWebDetox {
  static element(element, matcher) {
    function element1(matcher) {
      if (typeof matcher !== 'object' || !matcher instanceof Array) {
        throw new Error('matcher must be an array, got ' + typeof matcher);
      }

      return {
        target: element,
        method: "element",
        args: [{
          type: "Atom<List<ElementReference>>",
          value: matcher
        }]
      };
    }

    function element2(matcher, index) {
      if (typeof matcher !== 'object' || !matcher instanceof Array) {
        throw new Error('matcher must be an array, got ' + typeof matcher);
      }

      if (typeof index !== "number") throw new Error("index should be a number, but got " + (index + (" (" + (typeof index + ")"))));
      return {
        target: element,
        method: "element",
        args: [{
          type: "Atom<List<ElementReference>>",
          value: matcher
        }, {
          type: "Integer",
          value: index
        }]
      };
    }

    if (arguments.length === 1) {
      return element1.apply(null, arguments);
    }

    if (arguments.length === 2) {
      return element2.apply(null, arguments);
    }
  }

  static get(element) {
    return {
      target: element,
      method: "get",
      args: []
    };
  }

  static tap(element) {
    return {
      target: element,
      method: "tap",
      args: []
    };
  }

  static scrollToView(element) {
    return {
      target: element,
      method: "scrollToView",
      args: []
    };
  }

  static getText(element) {
    return {
      target: element,
      method: "getText",
      args: []
    };
  }

  static runScript(element, script) {
    if (typeof script !== "string") throw new Error("script should be a string, but got " + (script + (" (" + (typeof script + ")"))));
    return {
      target: element,
      method: "runScript",
      args: [script]
    };
  }

  static runScriptWithArgs(element, script, args) {
    if (typeof script !== "string") throw new Error("script should be a string, but got " + (script + (" (" + (typeof script + ")"))));

    if (typeof args !== 'object' || !args instanceof Array) {
      throw new Error('args must be an array, got ' + typeof args);
    }

    return {
      target: element,
      method: "runScriptWithArgs",
      args: [script, {
        type: "ArrayList<Object>",
        value: args
      }]
    };
  }

  static getCurrentUrl(element) {
    return {
      target: element,
      method: "getCurrentUrl",
      args: []
    };
  }

  static getTitle(element) {
    return {
      target: element,
      method: "getTitle",
      args: []
    };
  }

  static webViewInteraction(element) {
    return {
      target: element,
      method: "webViewInteraction",
      args: []
    };
  }

  static toNotExists(element) {
    return {
      target: element,
      method: "toNotExists",
      args: []
    };
  }

  static toExists(element) {
    return {
      target: element,
      method: "toExists",
      args: []
    };
  }

  static toHaveText(element, text) {
    if (typeof text !== "string") throw new Error("text should be a string, but got " + (text + (" (" + (typeof text + ")"))));
    return {
      target: element,
      method: "toHaveText",
      args: [text]
    };
  }

  static getWebView() {
    function getWebView0() {
      return {
        target: {
          type: "Class",
          value: "com.wix.detox.espresso.web.EspressoWebDetox"
        },
        method: "getWebView",
        args: []
      };
    }

    function getWebView1(matcher) {
      return {
        target: {
          type: "Class",
          value: "com.wix.detox.espresso.web.EspressoWebDetox"
        },
        method: "getWebView",
        args: [{
          type: "Invocation",
          value: sanitize_matcher(matcher)
        }]
      };
    }

    if (arguments.length === 0) {
      return getWebView0.apply(null, arguments);
    }

    if (arguments.length === 1) {
      return getWebView1.apply(null, arguments);
    }
  }

  static expect(webElement) {
    return {
      target: {
        type: "Class",
        value: "com.wix.detox.espresso.web.EspressoWebDetox"
      },
      method: "expect",
      args: [{
        type: "WebElement",
        value: webElement
      }]
    };
  }

}

module.exports = EspressoWebDetox;