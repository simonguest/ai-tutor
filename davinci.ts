const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT = "/*\nIn one sentence, what does the above Java code do?";

const send = (code: string) => {
  console.log(`${PROMPT}\n\n${code}\n`);
  let openai = new OpenAIApi(configuration);
  const response = openai.createCompletion({
    model: "code-davinci-002",
    prompt: `${code.trim()}\n${PROMPT}`,
    stop: ["*/", "What"],
    temperature: 0,
    max_tokens: 50,
  });
  return response;
}

export { send }