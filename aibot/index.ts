import { showPanel, Panel } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { keymap } from "@codemirror/view";

import { isValid } from "./parser";
import { explain, translate } from "./openai";

const toggleHelp = StateEffect.define<any>();

const helpPanelState = StateField.define<any>({
  create: () => {},
  update(value, tr) {
    for (let e of tr.effects) if (e.is(toggleHelp)) value = e.value;
    return value;
  },
  provide: (f) => showPanel.from(f, (on) => (on ? createHelpPanel : null)),
});

function createHelpPanel(view: EditorView) {
  // Initialize the panel
  let dom = document.createElement("div");
  dom.className = "cm-help-panel";
  dom.textContent = '"Thinking..."';

    //TODO: Run through tree-sitter to ensure it's valid
    setTimeout(() => {
      view.dispatch({
        effects: toggleHelp.of({
          ...view.state.field(helpPanelState, false),
          command: "validate",
        }),
      });
    }, 1);

    //TODO: Run through moderation endpoint to ensure it's not offensive

  return {
    top: true,
    dom,
    update(update) {
      /* Thoughts on update logic:

      { apiKey: "*", language: "ja-jp", command: "moderate | explain | translate", result: "text", error: "text" }

      */
      console.log("Update in viewPlugin");
      let effect = update.state.field(helpPanelState, false);
      console.log(effect);

      // Capture the editor selection
      let range = view.state.selection.main;
      let doc = view.state.doc;
      let selection = doc.sliceString(range.from, range.to);

      if (effect.command === "validate" || !effect.command) {
        isValid(selection).then((response) => {
          if (response === true) {
            // Valid code - dispatch to make a request to OpenAI
            view.dispatch({
              effects: toggleHelp.of({
                ...view.state.field(helpPanelState, false),
                command: "explain",
              }),
            });
          } else {
            view.dispatch({
              effects: toggleHelp.of({
                ...view.state.field(helpPanelState, false),
                command: "display",
                result:
                  "The selection is not valid. Make sure you highlight a complete statement or block of code.",
              }),
            });
          }
        });
      }

      if (effect.command === "explain") {
        explain(selection).then((response) => {
          let answer = `\"${response.data.choices[0].text
            .replace("\n", " ")
            .trim()}\"`;
          view.dispatch({
            effects: toggleHelp.of({
              ...view.state.field(helpPanelState, false),
              command: "display",
              result: answer,
            }),
          });
        });
      }

      if (effect.command === "display") {
        if (effect.language === "en-us") {
          dom.textContent = effect.result;
        } else {
          dom.textContent = "Translating...";
          translate(effect.result, effect.language).then((response) => {
            dom.textContent = `${response.data.choices[0].text
              .replace("\n", " ")
              .trim()}`;
          });
        }
      }
    },
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
