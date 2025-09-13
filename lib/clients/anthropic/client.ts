import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv'
dotenv.config()

const client = new Anthropic({
  apiKey: (process.env.ANTHROPIC_API_KEY || "").trim(),
});

export default client;
