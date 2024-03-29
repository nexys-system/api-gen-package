import JWT from "jsonwebtoken";
import * as T from "./type";
import * as C from "./config";
import { getFolderToZip } from "./zip-utils";
import { decodeToken } from "./token-utils";
import { askForConfirmation } from "./utils";

/**
 * deploy API
 * @param payload
 * @param token
 * @returns
 */
export const deployApi = async (
  payload: {
    info: T.Info;
    jwtSecret:
      | string
      | { publicKey: string; privateKey: string; algorithm: JWT.Algorithm };
    endpoints: T.Endpoint[];
    oAuthParamsArray: T.OAuthParams[];
  },
  token: string,
  host:string = C.host
) => {
  const { instanceUuid, productId } = decodeToken(token);

  const yesNo = await askForConfirmation();

  if(!yesNo) {
    throw Error('process aborted');
  }

  const body = JSON.stringify({
    data: JSON.stringify({...payload, token}), // "data" is given as string
    product: { id: productId },
    instance: { uuid: instanceUuid },
  });

  const response = await fetch(host + "/product/backend/upload", {
    method: "POST",
    headers: { "content-type": "application/json", token },
    body,
  });

  return response.json();
};

/**
 * send assets belonging to the API
 * especially relevant for WASM
 * @param folderPath
 * @param token
 * @returns
 */
export const sendBackendAssets = async (folderPath: string, token: string) => {
  const fileContent = await getFolderToZip(folderPath);

  const blob = new Blob([fileContent], { type: "application/zip" });
  const body = new FormData();
  body.set("file", blob);

  const url = C.host + "/product/backend/upload-assets";
  const response = await fetch(url, {
    method: "POST",
    body,
    headers: { token },
  });

  return response.json();
};
