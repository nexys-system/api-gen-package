import JWT from "jsonwebtoken";
import * as T from "./type";
import { getFolderToZip } from "./zip-utils";
import { decodeToken } from "./token-utils";

const host = "https://app.nexys.io/api";

export const deployApi = async (
  payload: {
    info: T.Info;
    token: string;
    jwtSecret:
      | string
      | { publicKey: string; privateKey: string; algorithm: JWT.Algorithm };
    endpoints: T.Endpoint[];
    oAuthParamsArray: T.OAuthParams[];
  },
  token: string
) => {
  const { instanceUuid, productId } = decodeToken(payload.token);

  const body = JSON.stringify({
    data: JSON.stringify(payload), // "data" is given as string
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

export const sendBackendAssets = async (folderPath: string, token: string) => {
  const fileContent = await getFolderToZip(folderPath);

  const blob = new Blob([fileContent], { type: "application/zip" });
  const body = new FormData();
  body.set("file", blob);

  const url = host + "/product/backend/upload-assets";
  const response = await fetch(url, {
    method: "POST",
    body,
    headers: { token },
  });

  return response.json();
};
