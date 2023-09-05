import readline from "readline";
import * as C from "../config";
import fs, { promises as fsp } from "fs";
import { createEntities } from "./utils";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const getAssets = async (appToken: string) => {
  const url = C.host + C.pathAssets + appToken;

  const r = await fetch(url, { method: "GET" });
  if (r.status !== 200) {
    throw Error(await r.text());
  }

  const { version, model } = (await r.json()) as any;

  if (!model) {
    throw Error("model is undefined");
  }

  console.log(
    `Version ${version} was fetched. It contains ${model.length} entities`
  );

  rl.question(
    `Would you like to create the file in "${C.outFolder}"? [y/n] `,
    async (answer) => {
      if (answer !== "y") {
        throw Error("process aborted, answer: " + answer);
      }

      // create dir (if not exist)
      await fsp.mkdir(C.outFolder, { recursive: true });

      const pathAndContents = [
        ["/model.json", JSON.stringify(model)],
        ["/entities.ts", createEntities(model)],
      ];

      pathAndContents.forEach(([filepath, content]) => {
        const outFilepath = C.outFolder + filepath;
        console.log("- writing to file: " + outFilepath);
        fs.writeFileSync(outFilepath, content, "utf-8");
      });

      rl.close();
    }
  );
};
