"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.PluginInstanceContainerController = void 0;
var DockerodeHelper = require("@gluestack/helpers").DockerodeHelper;
var getRouterJson_1 = require("./helpers/getRouterJson");
var generateNginxConfig_1 = require("./helpers/generateNginxConfig");
var routerList_1 = require("./commands/routerList");
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return {};
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _e = {
                            Image: "nginx:latest",
                            RestartPolicy: {
                                Name: "always"
                            }
                        };
                        _a = "".concat;
                        return [4, this.getDefaultConfPath()];
                    case 1:
                        _b = [
                            _a.apply("", [_f.sent(), ":/etc/nginx/conf.d/default.conf"])
                        ];
                        _c = "".concat;
                        return [4, this.getSslFilesPath()];
                    case 2:
                        _b = _b.concat([
                            _c.apply("", [_f.sent(), "/fullchain.pem:/etc/ssl/fullchain.pem"])
                        ]);
                        _d = "".concat;
                        return [4, this.getSslFilesPath()];
                    case 3: return [2, (_e.Binds = _b.concat([
                            _d.apply("", [_f.sent(), "/privkey.pem:/etc/ssl/privkey.pem"])
                        ]),
                            _e)];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDefaultConfPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routes, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, getRouterJson_1.getRouterJson)()];
                    case 1:
                        routes = _a.sent();
                        path = (0, generateNginxConfig_1.generateNginxConfig)(routes, this.callerInstance.callerPlugin.app.plugins).path;
                        return [2, process.cwd() + "".concat(path.substring(1))];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getSslFilesPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, (process.cwd() + "/node_modules/@gluestack/glue-plugin-dev-router/ssl-cert")];
            });
        });
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function () {
        return this.portNumber;
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        return (this.status = status || "down");
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        return (this.portNumber = portNumber || null);
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
        this.callerInstance.gluePluginStore.set("container_id", containerId || null);
        return (this.containerId = containerId || null);
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.getStatus() === "up")) return [3, 2];
                        return [4, this.down()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            var _this = this;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = (_a = DockerodeHelper).up;
                                        return [4, this.getDockerJson()];
                                    case 1:
                                        _b.apply(_a, [_c.sent(), this.getEnv(),
                                            this.portNumber,
                                            this.callerInstance.getName()])
                                            .then(function (_a) {
                                            var status = _a.status, containerId = _a.containerId;
                                            return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            this.setStatus(status);
                                                            this.setContainerId(containerId);
                                                            return [4, (0, routerList_1.runner)(this.callerInstance.callerPlugin)];
                                                        case 1:
                                                            _b.sent();
                                                            return [2, resolve(true)];
                                                    }
                                                });
                                            });
                                        })["catch"](function (e) {
                                            return reject(e);
                                        });
                                        return [2];
                                }
                            });
                        }); })];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                DockerodeHelper.down(this.getContainerId(), this.callerInstance.getName())
                                    .then(function () {
                                    _this.setStatus("down");
                                    _this.setContainerId(null);
                                    return resolve(true);
                                })["catch"](function (e) {
                                    return reject(e);
                                });
                                return [2];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map