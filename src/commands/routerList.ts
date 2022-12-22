import { IRoute } from "../interface/IRoute";
import { getRouterJson } from "../helpers/getRouterJson";
import { sampleRouterJson } from "../constants/sampleRouterJson";
import { generateNginxConfig } from "../helpers/generateNginxConfig";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";

export async function runner(glueStackPlugin: IPlugin) {
  let routes: any = await getRouterJson();
  if (
    !routes ||
    typeof routes !== "object" ||
    routes === undefined ||
    (typeof routes === "object" && Object.keys(routes).length === 0)
  ) {
    console.log("\x1b[33m");
    console.log(
      "No routes have been registered with your gluestack app",
      "\x1b[0m",
      "\x1b[35m",
    );
    console.log("Use this sample router.json and edit meta/router.json");
    console.log("\x1b[0m");
    console.log(sampleRouterJson);
  } else {
    const { urls } = generateNginxConfig(
      routes,
      //@ts-ignore
      glueStackPlugin.app.plugins,
      false,
    );
    if (!urls || !urls.length) {
      console.log("\x1b[33m");
      console.log(
        "No routes could be loaded, is your gluestack app running on local?",
        "\x1b[0m",
      );
    } else {
      console.table(urls);
    }
  }
  console.log();
}

export function routerList(program: any, glueStackPlugin: IPlugin) {
  return program
    .command("route:list")
    .description("Prints a table of entries of the registered routes")
    .action(() => runner(glueStackPlugin));
}

/*
  const showRoutes: any = [];
  Object.keys(routes).filter((key: string) => {
    if (!key.startsWith("@")) {

      const domainRoutes: IRoute[] = routes[key];
      domainRoutes.map((domainRoute: IRoute) => {
        showRoutes.push({
          instance: domainRoute.proxy.instance,
          url: `https://${key}${domainRoute.path}`,
          local_mapping: `http://localhost:${domainRoute.proxy.path}${domainRoute.proxy.path}`,
        });
      });
    }
  });
  console.table(showRoutes);
*/
