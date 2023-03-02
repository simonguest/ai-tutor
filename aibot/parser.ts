import Parser from "web-tree-sitter";

import { debug } from "./utils";

const isValid = (code: string, strict: string) => {
  return new Promise((resolve, reject) => {
    Parser.init().then(() => {
      // First scan for comments - this throws off the Codex API (as our meta prompt is a comment)
      if (code.includes("/*") || code.includes("//")) {
        resolve(false);
      }
      if (strict !== "true") {
        resolve(true);
      }
      // Now, let's run the code through the parser to ensure it's valid
      debug("Parser initialized");
      const Java = Parser.Language.load("/tree-sitter-java.wasm").then(
        (Java) => {
          const parser = new Parser();
          parser.setLanguage(Java);
          debug("Java grammar loaded");
          let tree = parser.parse(code);
          debug(tree.rootNode.toString());
          if (tree.rootNode.hasError()) {
            debug("Parse error");
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  });
};

export { isValid };
