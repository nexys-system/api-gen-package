import { generateKeyPairSync } from "crypto";
import JWT from "jsonwebtoken";

export const decodeToken = (token: string) => {
  const decodedToken = JWT.decode(token);

  if (!decodedToken || typeof decodedToken === "string") {
    throw Error("cuold not decode token");
  }

  if (!("product" in decodedToken)) {
    throw Error("cuold not find product in token");
  }

  if (!("instance" in decodedToken)) {
    throw Error("could not find instance in token");
  }

  return {
    instanceUuid: decodedToken.instance,
    productId: decodedToken.product,
  };
};

export const generateJWTAsync = (): {
  publicKey: string;
  privateKey: string;
  algorithm: JWT.Algorithm;
} => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  // to string (pem format)
  const ePublicKey = publicKey.export({ type: "spki", format: "pem" });
  const ePrivateKey = privateKey.export({ type: "pkcs8", format: "pem" });

  return {
    publicKey: ePublicKey as string,
    privateKey: ePrivateKey as string,
    algorithm: "RS256",
  };
};
