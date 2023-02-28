import { showPanel, Panel } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { keymap } from "@codemirror/view";

import { explain, translate } from "../openai";

const toggleHelp = StateEffect.define<boolean>();

const helpPanelState = StateField.define<boolean>({
  create: () => false,
  update(value, tr) {
    for (let e of tr.effects) if (e.is(toggleHelp)) value = e.value;
    return value;
  },
  provide: (f) => showPanel.from(f, (on) => (on ? createHelpPanel : null)),
});

function createHelpPanel(view: EditorView) {
  console.log(view);
  // Create the panel
  let dom = document.createElement("div");
  dom.className = "cm-help-panel";
  dom.textContent = "\"I'm inspecting the code...\"";

  // Capture the editor selection
  let range = view.state.selection.main;
  let doc = view.state.doc;
  let selection = doc.sliceString(range.from, range.to);

  if (selection.length > 0) {
    //TODO: Run through lezer to ensure it's valid

    //TODO: Run through moderation endpoint to ensure it's not offensive

    // Send selection to OpenAI
    explain(selection).then((response) => {
      let answer = `\"${response.data.choices[0].text.replace("\n", " ").trim()}\"`;
      dom.textContent = answer;
      // translate(answer, "Swahili").then((response) => {
      //   dom.textContent = `${response.data.choices[0].text.replace("\n", " ").trim()}`;
      // });
    });
    
  }

  return {
    top: true,
    dom,
  };
}

const helpKeymap = [
  {
    key: "F1",
    run(view) {
      view.dispatch({
        effects: toggleHelp.of(true),
      });
      return true;
    },
  },
];

const helpTheme = EditorView.baseTheme({
  ".cm-help-panel": {
    height: "20px",
    padding: "10px 50px",
    backgroundColor: "#fffa8f",
    fontFamily: "monospace",
    backgroundImage: "url('./images/aibot.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "35px",
  },
});

const helpPanel = () => {
  return [helpPanelState, keymap.of(helpKeymap), helpTheme];
};

export { toggleHelp, helpPanel };
