// https://platform.openai.com/docs/api-reference/chat/create
// https://json-schema.org/understanding-json-schema/reference/array.html

import schema from "./schema";

import * as Prompts from "./prompts";

import { Message, PayloadFunction } from "@nexys/openai-client/dist/type";
import { getChatCompletion } from "@nexys/openai-client";

export const getAPIEndpointFromLLM = async (
  message: string,
  openApiKey: string
) => {
  const schemaEndpoint = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      typescriptCode: {
        type: "string",
      },
      description: {
        type: "string",
      },
    },
  };
  const userPrompt: Message = { role: "user", content: message };
  const messages: Message[] = [Prompts.systemPrompt, userPrompt];
  const functions: PayloadFunction[] = [
    {
      name: "insert_endpoint",
      description: "inserts endpoint into db",
      parameters: schemaEndpoint as any,
    },
  ];

  console.log(functions);

  console.log("input messages", messages);

  return getChatCompletion(
    {
      messages,
      functions,
      model: "gpt-4",
    },
    openApiKey
  );
};
