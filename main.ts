import { EditorView, basicSetup } from "codemirror";
import { ViewPlugin } from "@codemirror/view";
import { java } from "@codemirror/lang-java";

import { helpPanel, toggleHelp } from "./aibot";

const run = async () => {
  // UI elements
  const codeButton = document.getElementById("code-button");

  const codeButtonEnabled = class {
    constructor(view) {}
    update(update) {
      let from = update.state.selection.main.from;
      let to = update.state.selection.main.to;
      if (from !== to) {
        if (codeButton?.attributes.getNamedItem("disabled")) {
          codeButton?.attributes.removeNamedItem("disabled");
        }
      } else {
        codeButton?.attributes.setNamedItem(
          document.createAttribute("disabled")
        );
      }
    }
  };

  // get language from URL param
  const urlParams = new URLSearchParams(window.location.search);
  const language = urlParams.get("language") || "en-us";

  // Load the main.java file into the editor
  const code = await fetch("/main.java").then((response) => response.text());

  let editor = new EditorView({
    extensions: [
      basicSetup,
      java(),
      helpPanel(),
      ViewPlugin.fromClass(codeButtonEnabled),
    ],
    parent: document.getElementById("editor") as Element,
    doc: code,
  });

  if (codeButton) {
    codeButton.onclick = () => {
      // Handle AI Bot tooltip click
      editor.dispatch({
        effects: toggleHelp.of({ language: language }),
      });
    };
  }
};
run();
