import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import * as fs from "fs";
import { GlueStackPlugin } from "..";
import { IHasRoute } from "../interface/IRoute";

export function getInstanceByName(
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
    "localhost"
  );
}

function addConfig(json: any, route: any, instances: any) {
  let url = "";
  const instance = getInstanceByName(instances, route.proxy.instance);
  let config = "";
  if (instance?.getContainerController()?.portNumber) {
    url = `http://${getIpAddress(
      //@ts-ignore
      instance.getContainerController(),
    )}:${instance.getContainerController().portNumber}${route.proxy.path}`;
    config += `
  location ${route.path} {
    proxy_pass ${url};
  }`;
  }
  return {
    str: config,
    url: url,
  };
}

export function generateNginxConfig(
  json: any,
  plugins: GlueStackPlugin[],
  write: boolean = true,
) {
  const instances: IInstance[] = [];
  let urls: any = [];

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
    let rootPath: any = null;
    json[key].forEach((route: any) => {
      if (route.path === "/") {
        rootPath = route;
      }
    });

    config += `server {
    listen 80;
    server_name ${key};
    return 301 https://$host$request_uri;
}

server {
  listen 443;
  server_name ${key};
  ssl_certificate     /etc/ssl/fullchain.pem;
  ssl_certificate_key /etc/ssl/privkey.pem;
  ssl on;
  ssl_session_cache  builtin:1000  shared:SSL:10m;
  ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
  ssl_prefer_server_ciphers on;`;

    if (rootPath) {
      const { str, url }: any = addConfig(json, rootPath, instances);
      config += str;
      if (url) {
        pushUrl(urls, url, key, rootPath);
      }
    }

    json[key].forEach((route: any) => {
      if (route.path === "/") {
        return;
      }
      const { str, url }: any = addConfig(json, route, instances);
      config += str;
      if (url) {
        pushUrl(urls, url, key, route);
      }
    });
    config += "\n}\n\n";
  });

  if (write) {
    if (!fs.existsSync("./conf.d")) {
      fs.mkdirSync("./conf.d", { recursive: true });
    }

    fs.writeFileSync("./conf.d/default.conf", config);
  }

  return {
    path: "./conf.d/default.conf",
    config: config,
    urls: urls,
  };
}

function pushUrl(urls: any = [], url: string, key: string, route: any) {
  urls.push({
    "local url": url,
    "https url (coming soon)": `https://${key}${route.path}`,
  });
}

/*if ("@middleware" in route) {
      config += `
  location ${route.path} {
    proxy_pass http://${getIpAddress(
      //@ts-ignore
      instance.getContainerController(),
    )}:${instance.getContainerController().portNumber};
    proxy_set_header X-Pre-Middleware ${
      json["@middlewares"][route["@middleware"]].instance
    };
  }`;
    }
*/
