const debug = (message: any) => {
  switch (typeof message) {
    case "object":
      console.log(`[AI Tutor] ${JSON.stringify(message)}`);
      break;
    default:
      console.log(`[AI Tutor] ${message}`);
  }
};

export { debug };
