import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import * as fs from "fs";
import { GlueStackPlugin } from "src";
import { IHasRoute } from "src/interface/IRoute";

function getInstanceByName(
  instances: (IInstance & IHasContainerController)[],
  name: string,
) {
  return instances.filter((instance) => {
    if (instance.getName() === name) return instance;
  })[0];
}

function getIpAddress(containerController: IContainerController & IHasRoute) {
  return (
    (containerController.getIpAddress && containerController.getIpAddress()) ||
    "127.0.0.1"
  );
}

function addConfig(json: any, route: any, instances: any) {
  const instance = getInstanceByName(instances, route.proxy.instance);
  let config = "";
  if (instance?.getContainerController()?.getPortNumber()) {
    if ("@middleware" in route) {
      config += `
  location / {
    proxy_pass http://${getIpAddress(
      //@ts-ignore
      instance.getContainerController(),
    )}:${instance.getContainerController().getPortNumber()};
    proxy_set_header X-Pre-Middleware ${
      json["@middlewares"][route["@middleware"]].instance
    };
  }`;
    } else {
      config += `
  location / {
    proxy_pass http://${getIpAddress(
      //@ts-ignore
      instance.getContainerController(),
    )}:${instance.getContainerController().getPortNumber()};
  }`;
    }
  }
  return config;
}

export function generateNginxConfig(json: any, plugins: GlueStackPlugin[]) {
  const instances: IInstance[] = [];

  for (const plugin of plugins) {
    for (const instance of plugin.getInstances()) {
      instances.push(instance);
    }
  }

  let config = "";
  Object.keys(json).forEach((key) => {
    if (key.startsWith("@")) {
      return;
    }
    let rootPath: any = {};
    json[key].forEach((route: any) => {
      if (route.path === "/") {
        rootPath = route;
      }
    });

    config += `server {
  server_name ${key};`;

    if (rootPath) {
      config += addConfig(json, rootPath, instances);
    }

    json[key].forEach((route: any) => {
      if (route.path === "/") {
        return;
      }
      config += addConfig(json, route, instances);
    });
    config += "\n}\n";
  });

  if (!fs.existsSync("./conf.d")) {
    fs.mkdirSync("./conf.d", { recursive: true });
  }

  fs.writeFileSync("./conf.d/default.conf", config);

  return {
    path: "./conf.d/default.conf",
    config: config,
  };
}
