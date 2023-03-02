const { Configuration, OpenAIApi } = require("openai");

import { debug } from "./utils";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_ROLE_CONTENT =
  "You are a teaching assistant who is helping a 10 year old learn computer science.";

const explain = (code: string) => {
  const META_PROMPT =
    "In two sentences, what does the following Java code do?\n\n";
  const PROMPT = `${META_PROMPT}\`\`\`${code.trim()}\n\`\`\``;
  return new Promise((resolve, reject) => {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_ROLE_CONTENT },
          { role: "user", content: PROMPT },
        ],
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        debug(response.choices[0].message.content);
        resolve(response.choices[0].message.content);
      });
  });
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
