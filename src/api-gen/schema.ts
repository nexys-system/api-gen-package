const schemaEndpoint = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
    tag: {
      type: "string",
    },
    method: {
      type: "string",
      enum: ["GET", "POST", "PUT", "DELETE"],
    },
    path: {
      type: "string",
    },
    permissions: {
      type: "array",
      items: {
        type: "string",
      },
    },
    bodyShape: {
      type: "object",
    },

    blocks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          chainBlockMap: {
            type: "object",
            additionalProperties: {
              type: "array",
            },
          },
          crud: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "list",
                  "detail",
                  "insert",
                  "update",
                  "delete",
                  "insertMultiple",
                ],
              },
              entity: {
                type: "string",
              },
              projection: {
                type: "object",
              },
              filters: {
                type: "object",
              },
              references: {
                type: "object",
              },
              data: {
                type: "object",
              },
            },
            required: ["type", "entity"],
          },
          codeSnippet: {
            type: "object",
            properties: {
              code: {
                type: "string",
              },
            },
            required: ["code"],
          },
          operator: {
            type: "object",
            properties: {
              condition: {
                type: "string",
              },
              nextTrue: {
                type: "number",
              },
              nextFalse: {
                type: "number",
              },
            },
            required: ["condition"],
          },
          stop: {
            type: "boolean",
          },
          status: {
            type: "number",
          },
        },
      },
    },
    output: {
      type: "object",
    },
    routeChainMap: {
      type: "object",
    },
    statusOut: {
      type: "number",
    },
  },
  required: ["method", "path", "blocks"],
};

delete (schemaEndpoint as any).properties.blocks.items.properties;

//console.log(JSON.stringify(schemaEndpoint));

export default schemaEndpoint;
