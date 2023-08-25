import Zip from "node-zip";
import fs from "fs";

export const getFolderToZip = async (path: string): Promise<Buffer> => {
  const zip = new Zip();
  const files = fs.readdirSync(path);
  files.forEach((filename) => {
    console.log("adding to zip archive: ", filename);
    const filepath = path + "/" + filename;
    const fileContent = fs.readFileSync(filepath);
    zip.file(filename, fileContent);
  });

  // Generate the ZIP content in a Buffer
  return zip.generate({ type: "nodebuffer" });

  //console.log(typeof zipBuffer);
  //fs.promises.writeFile("./pkg.zip", zipBuffer).then((x) => console.log(x));
  // here do the zip conversion
  //return fs.promises.readFile("./pkg.zip");
};
