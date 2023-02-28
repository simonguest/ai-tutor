const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


    //TODO: Prompt design for students

    //TODO: Maybe look at other language


const explain = (code: string) => {
  const PROMPT = "/*\nIn one sentence, what does the above Java code do?";
  let openai = new OpenAIApi(configuration);
  const response = openai.createCompletion({
    model: "code-davinci-002",
    prompt: `${code.trim()}\n${PROMPT}`,
    stop: ["*/"],
    temperature: 0,
    max_tokens: 50,
  });
  return response;
}

const translate = (text: string, language: string) => {
  const PROMPT = `Convert ${text} to ${language}`;
  let openai = new OpenAIApi(configuration);
  const response = openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${PROMPT}`,
    temperature: 0,
    max_tokens: 50,
  });
  return response;
}


export { explain, translate }