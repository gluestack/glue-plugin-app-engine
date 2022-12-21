interface IProxy {
  instance: string;
  path: string;
}

export interface IRoute {
  path: string;
  proxy: IProxy;
}

export interface IHasRoute {
  ipAddress: string;
  getIpAddress(): any;
}
