const { Configuration, OpenAIApi } = require("openai");

import { debug } from "./utils";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const explain = (code: string) => {
  const META_PROMPT = "/*\nIn one sentence, what does the above Java code do?";
  const PROMPT = `${code.trim()}\n${META_PROMPT}`;
  debug(PROMPT);
  let openai = new OpenAIApi(configuration);
  const response = openai.createCompletion({
    model: "code-davinci-002",
    prompt: PROMPT,
    stop: ["*/"],
    temperature: 0,
    max_tokens: 50,
  });
  return response;
};

const translate = (text: string, language: string) => {
  const META_PROMPT = `Convert ${text} to ${language}`;
  debug(META_PROMPT);
  let openai = new OpenAIApi(configuration);
  const response = openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${META_PROMPT}`,
    temperature: 0,
    max_tokens: 50,
  });
  return response;
};

const moderate = (text: string) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        debug(response);
        resolve(!response.results[0].flagged);
      });
  });
};

export { explain, translate, moderate };
