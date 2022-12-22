const { DockerodeHelper } = require("@gluestack/helpers");
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IContainerController from "@gluestack/framework/types/plugin/interface/IContainerController";
import { getRouterJson } from "./helpers/getRouterJson";
import { generateNginxConfig } from "./helpers/generateNginxConfig";
import { runner as routerList } from "./commands/routerList";

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: IInstance;

  constructor(app: IApp, callerInstance: IInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): IInstance {
    return this.callerInstance;
  }

  getEnv() {
    return {};
  }

  async getDockerJson() {
    return {
      Image: "nginx:latest",
      RestartPolicy: {
        Name: "always",
      },
      Binds: [
        `${await this.getDefaultConfPath()}:/etc/nginx/conf.d/default.conf`,
        `${await this.getSslFilesPath()}/fullchain.pem:/etc/ssl/fullchain.pem`,
        `${await this.getSslFilesPath()}/privkey.pem:/etc/ssl/privkey.pem`,
      ],
    };
  }

  async getDefaultConfPath() {
    const routes: any = await getRouterJson();
    const { path } = generateNginxConfig(
      routes,
      //@ts-ignore
      this.callerInstance.callerPlugin.app.plugins,
    );

    return process.cwd() + `${path.substring(1)}`;
  }

  async getSslFilesPath() {
    return (
      process.cwd() + `/node_modules/@gluestack/glue-plugin-dev-router/ssl-cert`
    );
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  getPortNumber(): number {
    return this.portNumber;
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    return (this.status = status || "down");
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    return (this.portNumber = portNumber || null);
  }

  setContainerId(containerId: string) {
    this.callerInstance.gluePluginStore.set(
      "container_id",
      containerId || null,
    );
    return (this.containerId = containerId || null);
  }

  getConfig(): any {}

  async up() {
    if (this.getStatus() === "up") {
      await this.down();
    }
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.up(
        await this.getDockerJson(),
        this.getEnv(),
        this.portNumber,
        this.callerInstance.getName(),
      )
        .then(
          async ({
            status,
            containerId,
          }: {
            status: "up" | "down";
            containerId: string;
          }) => {
            this.setStatus(status);
            this.setContainerId(containerId);
            await routerList(this.callerInstance.callerPlugin);
            return resolve(true);
          },
        )
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async down() {
    await new Promise(async (resolve, reject) => {
      DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
        .then(() => {
          this.setStatus("down");
          this.setContainerId(null);
          return resolve(true);
        })
        .catch((e: any) => {
          return reject(e);
        });
    });
  }

  async build() {
    //
  }
}
