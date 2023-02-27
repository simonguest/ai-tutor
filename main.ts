import { EditorView, basicSetup } from "codemirror";
import { java } from "@codemirror/lang-java";

import { helpPanel, toggleHelp } from "./aibot";

const run = async () => {
  let editor = new EditorView({
    extensions: [basicSetup, java(), helpPanel()],
    parent: document.getElementById("editor") as Element,
  });

  // Initial code state
  editor.dispatch({
    changes: {
      from: 0,
      insert: 'using System;\n\nSystem.out.println("Hello World!");',
    },
  });

  const codeButton = document.getElementById("code-button");
  if (codeButton) {
    codeButton.onclick = () => {
      // Handle AI Bot tooltip click
      editor.dispatch({
        effects: toggleHelp.of(false),
      });
      editor.dispatch({
        effects: toggleHelp.of(true),
      });
    };
  }
};
run();
