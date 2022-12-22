import * as fs from "fs";
import * as os from "os";

export async function getRouterJson() {
  const path = process.cwd() + "/meta/routes.json";
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}, null, 2) + os.EOL);
    return {};
  }

  const rawdata: any = fs.readFileSync(path);
  return JSON.parse(rawdata);
}
