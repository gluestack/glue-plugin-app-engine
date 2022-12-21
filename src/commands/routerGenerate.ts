import { getRouterJson } from "../helpers/getRouterJson";
import { generateNginxConfig } from "../helpers/generateNginxConfig";
import { GlueStackPlugin } from "src";

async function runner(glueStackPlugin: GlueStackPlugin) {
  const routes: any = await getRouterJson();
  const { config, path } = generateNginxConfig(
    routes,
    //@ts-ignore
    glueStackPlugin.app.plugins,
  );
  console.log("\x1b[32m");
  console.log(`nginx config saved to ${path}`, "\x1b[0m");
  console.log("\x1b[33m");
  console.log(config);
  console.log("\x1b[0m");
}

export function routerGenerate(program: any, glueStackPlugin: GlueStackPlugin) {
  return program
    .command("route:generate")
    .description("Generates nginx config from registered routes")
    .action(() => runner(glueStackPlugin));
}
