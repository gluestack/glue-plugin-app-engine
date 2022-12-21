import { IRoute } from "../interface/IRoute";
import { getRouterJson } from "../helpers/getRouterJson";

async function runner() {
  const routes: any = await getRouterJson();
  Object.keys(routes).filter((key: string) => {
    if (!key.startsWith("@")) {
      const domainRoutes: IRoute[] = routes[key];
      console.log();
      console.log(`${key} routes`);
      console.table(
        domainRoutes.map((domainRoute: IRoute) => {
          return {
            instance: domainRoute.proxy.instance,
            "proxy path": domainRoute.proxy.path,
            path: domainRoute.path,
          };
        }),
      );
      console.log();
    }
  });
}

export function routerList(program: any) {
  return program
    .command("route:list")
    .description("Prints a table of entries of the registered routes")
    .action(() => runner());
}
