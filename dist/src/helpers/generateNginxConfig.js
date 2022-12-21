"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.generateNginxConfig = void 0;
var fs = __importStar(require("fs"));
function getInstanceByName(instances, name) {
    return instances.filter(function (instance) {
        if (instance.getName() === name)
            return instance;
    })[0];
}
function getIpAddress(containerController) {
    return ((containerController.getIpAddress && containerController.getIpAddress()) ||
        "127.0.0.1");
}
function addConfig(json, route, instances) {
    var _a;
    var instance = getInstanceByName(instances, route.proxy.instance);
    var config = "";
    if ((_a = instance === null || instance === void 0 ? void 0 : instance.getContainerController()) === null || _a === void 0 ? void 0 : _a.getPortNumber()) {
        if ("@middleware" in route) {
            config += "\n  location / {\n    proxy_pass http://".concat(getIpAddress(instance.getContainerController()), ":").concat(instance.getContainerController().getPortNumber(), ";\n    proxy_set_header X-Pre-Middleware ").concat(json["@middlewares"][route["@middleware"]].instance, ";\n  }");
        }
        else {
            config += "\n  location / {\n    proxy_pass http://".concat(getIpAddress(instance.getContainerController()), ":").concat(instance.getContainerController().getPortNumber(), ";\n  }");
        }
    }
    return config;
}
function generateNginxConfig(json, plugins) {
    var instances = [];
    for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
        var plugin = plugins_1[_i];
        for (var _a = 0, _b = plugin.getInstances(); _a < _b.length; _a++) {
            var instance = _b[_a];
            instances.push(instance);
        }
    }
    var config = "";
    Object.keys(json).forEach(function (key) {
        if (key.startsWith("@")) {
            return;
        }
        var rootPath = {};
        json[key].forEach(function (route) {
            if (route.path === "/") {
                rootPath = route;
            }
        });
        config += "server {\n  server_name ".concat(key, ";");
        if (rootPath) {
            config += addConfig(json, rootPath, instances);
        }
        json[key].forEach(function (route) {
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
        config: config
    };
}
exports.generateNginxConfig = generateNginxConfig;
//# sourceMappingURL=generateNginxConfig.js.map