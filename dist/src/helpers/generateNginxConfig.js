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
exports.generateNginxConfig = exports.getInstanceByName = void 0;
var fs = __importStar(require("fs"));
function getInstanceByName(instances, name) {
    return instances.filter(function (instance) {
        if (instance.getName() === name)
            return instance;
    })[0];
}
exports.getInstanceByName = getInstanceByName;
function getIpAddress(containerController) {
    return ((containerController.getIpAddress && containerController.getIpAddress()) ||
        "localhost");
}
function addConfig(json, route, instances) {
    var _a;
    var url = "";
    var instance = getInstanceByName(instances, route.proxy.instance);
    var config = "";
    if ((_a = instance === null || instance === void 0 ? void 0 : instance.getContainerController()) === null || _a === void 0 ? void 0 : _a.portNumber) {
        url = "http://".concat(getIpAddress(instance.getContainerController()), ":").concat(instance.getContainerController().portNumber).concat(route.proxy.path);
        config += "\n  location ".concat(route.path, " {\n    proxy_pass ").concat(url, ";\n  }");
    }
    return {
        str: config,
        url: url
    };
}
function generateNginxConfig(json, plugins, write) {
    if (write === void 0) { write = true; }
    var instances = [];
    var urls = [];
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
        var rootPath = null;
        json[key].forEach(function (route) {
            if (route.path === "/") {
                rootPath = route;
            }
        });
        config += "server {\n    listen 80;\n    server_name ".concat(key, ";\n    return 301 https://$host$request_uri;\n}\n\nserver {\n  listen 443;\n  server_name ").concat(key, ";\n  ssl_certificate     /etc/ssl/fullchain.pem;\n  ssl_certificate_key /etc/ssl/privkey.pem;\n  ssl on;\n  ssl_session_cache  builtin:1000  shared:SSL:10m;\n  ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;\n  ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;\n  ssl_prefer_server_ciphers on;");
        if (rootPath) {
            var _a = addConfig(json, rootPath, instances), str = _a.str, url = _a.url;
            config += str;
            if (url) {
                pushUrl(urls, url, key, rootPath);
            }
        }
        json[key].forEach(function (route) {
            if (route.path === "/") {
                return;
            }
            var _a = addConfig(json, route, instances), str = _a.str, url = _a.url;
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
        urls: urls
    };
}
exports.generateNginxConfig = generateNginxConfig;
function pushUrl(urls, url, key, route) {
    if (urls === void 0) { urls = []; }
    urls.push({
        "local url": url,
        "https url (coming soon)": "https://".concat(key).concat(route.path)
    });
}
//# sourceMappingURL=generateNginxConfig.js.map