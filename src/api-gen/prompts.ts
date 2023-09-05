import { Message } from "@nexys/openai-client/dist/type";

export const promptContent: string = `import * as V from "@nexys/validation";

export interface CodeSnippetBlock {
  code: string;
}

type CrudBlockType =
  | "list"
  | "detail"
  | "insert"
  | "update"
  | "delete"
  | "insertMultiple";

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export type Output = { [k: string]: [number, string | null] };

// create state from previous state and params state
//[k: string]: k is the attribute of the state
//number | null: either index of previous block or ,if null, params state
//  string | null]: // [if null, take params, if null take full object]
export type ChainBlockMap = { [k: string]: [number | null, string | null] };

export interface CrudBlock {
  type: CrudBlockType;
  entity: string;
  projection?: {};
  filters?: {};
  references?: {};
  data?: {};
}

export interface BlockWrap {
  chainBlockMap?: ChainBlockMap;
  crud?: CrudBlock;
  codeSnippet?: CodeSnippetBlock;
  operator?: {
    condition: string;
    nextTrue?: number;
    nextFalse?: number;
  };
  stop?: boolean; // aborts execution
  status?: number;
  // todo out status, 400, etc?
}

type EndpointIn = "params" | "query" | "headers" | "body" | "jwtAuthorization";

// maps external inputs (body, authotirzation etc) to state
export type RouteChainMap = {
  [k: string]: [EndpointIn, string] | [EndpointIn, string, boolean];
};

interface EndpointMeta {
  title?: string;
  description?: string;
  tag?: string; // is used for openapi
}

export interface Endpoint extends EndpointMeta {
  method: Method;
  path: string;
  permissions?: string[];
  bodyShape?: V.Type.Shape;
  blocks: BlockWrap[];
  output?: ChainBlockMap;
  routeChainMap?: RouteChainMap;
  statusOut?: number;
}

the strcuture described above enables dev to easily describe endpoints in meta language:
* blocks are joined together making up chains
* these chains can be mapped onto an endpoint. The endpoint parameters: body, querystring, userId (stored in jwt) are mapped onto the chain inputs: RouteChainMap
* the output is JSON code that will then be executed by an already existing engine

Blocks are either:
* crud: they query the database using a json query language (see details below)
* code snippet: js/ts code 

crud language:
a data model is predefined, see structure below:
type FieldType = 'String' | 'Int' | 'Float' | 'BigDecimal' | 'Boolean' | 'LocalDate' | 'LocalDateTime';

interface Field {
  name: string;
  description?: string;
  type: FieldType | string; // string is when we refer to another Entity as a type; foreign key. In this case display the name of the entity. Important it can only reference a parent entity. (no children entity)
  optional: boolean;
}
  
interface Entity {
  name: string;
  description?: string;
  uuid: boolean;
  fields: Field[];
}
  
type DataModel = Entity[];

there are two types of crud blocks:
query (reads data):
export type QueryProjection<A = any> = {
  [key in keyof A]?: boolean | QueryProjection<any>;
};

export type QueryFilters<A = any> = {
  [key in keyof A]?: FilterAttribute | QueryFilters;
};

export interface QueryOrder {
  by: string;
  desc?: boolean;
}

export interface QueryParams {
  projection?: QueryProjection;
  filters?: QueryFilters;
  references?: References;
  order?: QueryOrder;
  take?: number;
  skip?: number;
}

export interface Query {
  [entity: string]: QueryParams;
}

and mutate:
export interface MutateParams<A = any> {
  insert?: { data: Omit<A, "id" | "uuid"> | Omit<A, "id" | "uuid">[] };
  update?: { data: Partial<A>; filters: QueryFilters };
  delete?: { filters: QueryFilters };
}

export interface Mutate<A = any> {
  [entity: string]: MutateParams<A>;
}

here's an example output:
import * as T from "./type";

const entity = "AttributeCategory";
const endpointPrefix = "/category";

const crudList: T.CrudBlock = {
  entity,
  type: "list",
  projection: {},
  filters: {},
};

const crudInsert: T.CrudBlock = {
  entity,
  type: "insert",
  data: { name: "$name" },
};

const crudUpdate: T.CrudBlock = {
  entity,
  type: "update",
  data: { name: "$name" },
  filters: { uuid: "$uuid" },
};

const crudDelete: T.CrudBlock = {
  entity,
  type: "delete",
  filters: { uuid: "$uuid" },
};

const endpoints: T.Endpoint[] = [
  {
    method: "GET",
    path: endpointPrefix + "/list",
    blocks: [{ crud: crudList }],
  },
  {
    method: "PUT",
    path: endpointPrefix + "/insert",
    bodyShape: { name: {} },
    routeChainMap: { name: ["body", "name"] },
    blocks: [{ crud: crudInsert }],
    statusOut: 201,
  },
  {
    method: "POST",
    path: endpointPrefix + "/:uuid",
    routeChainMap: { name: ["body", "name"], uuid: ["params", "uuid"] },
    bodyShape: { name: {} },
    blocks: [{ crud: crudUpdate }],
  },
  {
    method: "DELETE",
    path: endpointPrefix + "/:uuid",
    routeChainMap: { uuid: ["params", "uuid"] },
    blocks: [{ crud: crudDelete }],
  },
];

export default endpoints // add tag
  .map((x) => ({ ...x, tag: "Category" }))
  

and here's another example

  import * as T from "./type";

const codeReturnUser = {
  code: \`(data:{userId:string}) => 'user id is ' + data.userId;\`,
};

const codepPreIf = { code: \`() => ({a: 'hello'})\` };
const codepPreIf4 = {
  code: \`(data:{q:string}) => ({a: data.q})\`,
};
const codePostIf2 = { code: \`() => ({a: 'goodbye'})\` };
const codePostIf3 = { code: \`() => ({a: 'hasta luego'})\` };
const codeCondition = \`(d:{a:string}) => d.a === 'hello'\`;

const ifBlock: T.Endpoint = {
  method: "GET",
  path: "/if-block",
  blocks: [
    {
      codeSnippet: codepPreIf,
      operator: {
        condition: codeCondition,
        nextTrue: 1,
        nextFalse: 2,
      },
    },
    {
      codeSnippet: codePostIf2,
      stop: true,
    },
    {
      codeSnippet: codePostIf3,
    },
  ],
};

const ifBlock2: T.Endpoint = {
  method: "GET",
  path: "/if-block2",
  routeChainMap: { q: ["query", "q"] },
  blocks: [
    {
      codeSnippet: codepPreIf4,
      operator: {
        condition: codeCondition,
        nextTrue: 1,
        nextFalse: 2,
      },
    },
    {
      codeSnippet: codePostIf2,
      stop: true,
    },
    {
      codeSnippet: codePostIf3,
    },
  ],
  // output: { message: [2, "a"] },
};

const extracUser: T.Endpoint = {
  method: "GET",
  path: "/extract-user",
  permissions: ["app"],
  routeChainMap: { userId: ["jwtAuthorization", "id"] },
  blocks: [{ codeSnippet: codeReturnUser }],
  output: { message: [0, null] },
  tag: "Misc",
};

export default [extracUser, ifBlock, ifBlock2];`;

export const systemPrompt: Message = {
  role: "system",
  content: promptContent,
};
