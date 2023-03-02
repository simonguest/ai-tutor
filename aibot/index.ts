import { showPanel, Panel } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { keymap } from "@codemirror/view";

import { isValid } from "./parser";
import { explain, translate, moderate } from "./openai";
import { debug } from "./utils";

const INVALID_CODE_MESSAGE =
  "The selection is not valid. Please highlight a full statement or block of code. Also, please ensure you have not included any comments.";

const MODERATION_FAILED_MESSAGE =
  "The selection is not appropriate and violates Code.org's terms of service.";

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

  //TODO: Run through tree-sitter to ensure it's valid
  setTimeout(() => {
    view.dispatch({
      effects: toggleHelp.of({
        ...view.state.field(helpPanelState, false),
        command: "moderate",
      }),
    });
  }, 1);

  return {
    top: true,
    dom,
    update(update) {
      debug("Update in viewPlugin");
      let effect = update.state.field(helpPanelState, false);
      debug(effect);

      // Capture the editor selection
      let range = view.state.selection.main;
      let doc = view.state.doc;
      let selection = doc.sliceString(range.from, range.to);

      // Initial text update
      dom.textContent = "[Thinking]";

      if (effect.command === "moderate" || !effect.command) {
        moderate(selection).then((response) => {
          if (response === false) {
            view.dispatch({
              effects: toggleHelp.of({
                ...view.state.field(helpPanelState, false),
                command: "translate",
                result: MODERATION_FAILED_MESSAGE,
              }),
            });
          } else {
            view.dispatch({
              effects: toggleHelp.of({
                ...view.state.field(helpPanelState, false),
                command: "validate",
              }),
            });
          }
        });
      }

      if (effect.command === "validate") {
        isValid(selection, effect.strict).then((response) => {
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
                command: "translate",
                result: INVALID_CODE_MESSAGE,
              }),
            });
          }
        });
      }

      if (effect.command === "explain") {
        dom.textContent = "[Thinking]";
        explain(selection).then((response) => {
          let answer = `\"${response.data.choices[0].text
            .replace("\n", " ")
            .trim()}\"`;
          view.dispatch({
            effects: toggleHelp.of({
              ...view.state.field(helpPanelState, false),
              command: "translate",
              result: answer,
            }),
          });
        });
      }

      if (effect.command === "translate") {
        dom.textContent = "[Translating]";
        if (effect.language === "en-us") {
          setTimeout(() => {
            view.dispatch({
              effects: toggleHelp.of({
                ...view.state.field(helpPanelState, false),
                command: "display",
                result: effect.result,
              }),
            });
          }, 1);
        } else {
          translate(effect.result, effect.language).then((response) => {
            view.dispatch({
              effects: toggleHelp.of({
                ...view.state.field(helpPanelState, false),
                command: "display",
                result: `${response.data.choices[0].text
                  .replace("\n", " ")
                  .trim()}`,
              }),
            });
          });
        }
      }

      if (effect.command === "display") {
        dom.textContent = effect.result;
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
