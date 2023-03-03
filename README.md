# AI Tutor Prototype

AI Tutor a simple prototype that demonstrates how students can use Open AI's ChatGPT 3.5 to assist with analyzing and finding errors in code. The prototype uses a [CodeMirror 6](https://codemirror.net/) editor to simulate an IDE. Students highlight pieces of code and click on the "What does this code do?" or "Does this code have errors?" buttons to send to ChatGPT.

## Providing an Open AI API Key

To run the prototype, you'll need to provide your own Open AI API key. Grab an API key from the [Open AI platform site](https://platform.openai.com/) and use the following URL:

```https://simonguest.github.io/ai-tutor/?api-key=YOUR_API_KEY_GOES_HERE```

## Content Moderation

The prototype supports content moderation using [Open AI's moderation endpoint](https://platform.openai.com/docs/api-reference/moderations). To test, insert some code or a comment with a similar example to the one shown on the Open AI moderation page.

## Language Translation

The prototype also demonstrates ChatGPT's ability to translate content. To use, simply append the ```&language=LANGUAGE``` parameter to the URL. LANGUAGE can be locale specific (e.g., "ja-jp") or a full name (e.g., "Japanese"). The AI Tutor will then attempt to translate the output to the requested language.



