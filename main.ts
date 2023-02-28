import { EditorView, basicSetup } from "codemirror";
import { java } from "@codemirror/lang-java";

import { helpPanel, toggleHelp } from "./aibot";

const run = async () => {
  let editor = new EditorView({
    extensions: [basicSetup, java(), helpPanel()],
    parent: document.getElementById("editor") as Element,
    doc: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}'
  });

  const codeButton = document.getElementById("code-button");
  if (codeButton) {
    codeButton.onclick = () => {
      // Handle AI Bot tooltip click
      editor.dispatch({
        effects: toggleHelp.of(false),
      });
      editor.dispatch({
        effects: toggleHelp.of(true)
      });
    };
  }
};
run();
