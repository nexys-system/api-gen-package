// this should be in a library
import * as V from "@nexys/validation";

export interface CodeSnippetBlock {
  code?: string;
  ts?: string;
}

type CrudBlockType =
  | "list"
  | "detail"
  | "insert"
  | "update"
  | "delete"
  | "insertMultiple";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export type Output = { [k: string]: [number, string | null] };

export declare type AuthenticationServices =
  | "google"
  | "github"
  | "zoho"
  | "swissid"
  | "microsoft";
export interface OAuthParams {
  service: AuthenticationServices;
  clientId: string;
  secret: string;
  redirectUrl: string;
}

// create state from previous state and params state
//[k: string]: k is the attribute of the state
//number | null: either index of previous block or ,if null, params state
//  string | null]: // [if null, take params, if null take full object]
export type ChainBlockMap = { [k: string]: [number | null, string | null] };

export interface QueryOrder {
  by: string;
  desc?: boolean;
}

export interface CrudBlock {
  type: CrudBlockType;
  entity: string;
  projection?: {};
  filters?: {};
  references?: {};
  data?: {};
  order?: QueryOrder;
  take?: number;
  skip?: number;
}

export interface SQLBlock {
  statement: string;
}

export interface WasmBlock {
  name: string; // name/path of wasm module
  method: string; // method to be called
}

export interface BlockWrap {
  chainBlockMap?: ChainBlockMap;
  crud?: CrudBlock;
  sql?: SQLBlock;
  codeSnippet?: CodeSnippetBlock;
  wasm?: WasmBlock;
  operator?: {
    condition: string;
    nextTrue?: number;
    nextFalse?: number;
  };
  stop?: boolean; // aborts execution
  status?: number; // out status, 400, etc? default 200
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

export type StateOut = { [k: string | number]: any };

export interface State {
  status?: number; // http status that overrides endpoint status
  abortEarly: boolean; // if abort early (stop before all blocks, typcially after if statement, set flag to true)
  params: Map<string, string>;
  out: StateOut;
}

export const enum Env {
    prod = 3,
    test = 2,
    dev = 1
}

export interface Info {
  description?: string;
  title: string;
  version: string;
  servers?: { url: string }[]; // adds additional servers, in case the API is deployed under a different URL
  options?: { slackWebHook?: string };
  env?: Env;
}
