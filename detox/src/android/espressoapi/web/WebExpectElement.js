/**

	This code is generated.
	For more information see generation/README.md.
*/



class WebExpectElement {
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

}

module.exports = WebExpectElement;