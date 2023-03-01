import Parser from "web-tree-sitter";

const isValid = (code: string) => {
  return new Promise((resolve, reject) => {
    Parser.init().then(() => {
      console.log("[Parser] initialized");
      const Java = Parser.Language.load("/tree-sitter-java.wasm").then((Java) => {
        const parser = new Parser();
        parser.setLanguage(Java);
        console.log("[Parser] Java grammar loaded");
        let tree = parser.parse(code);
        console.log(tree.rootNode.toString());
        if (tree.rootNode.hasError()) {
          console.log("[Parser] Error detected");
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  });
};

export { isValid };
