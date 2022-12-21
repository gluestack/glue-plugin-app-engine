import * as fs from "fs";
import * as os from "os";

export async function getRouterJson() {
  if (!fs.readFileSync) {
    fs.writeFileSync(
      process.cwd() + "/meta/routes.json",
      JSON.stringify({}, null, 2) + os.EOL,
    );
  }

  const rawdata: any = fs.readFileSync(process.cwd() + "/meta/routes.json");
  return JSON.parse(rawdata);
}
