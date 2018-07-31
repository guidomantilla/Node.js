"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http = require("http");
const https = require("https");
const lodash = require("lodash");
const config_1 = require("./config");
const server_1 = require("./lib/server");
if (!lodash.isUndefined(config_1.environment)) {
    const httpServer = http.createServer((request, response) => {
        server_1.server.handler(request, response);
    });
    httpServer.listen(config_1.environment.httpPort, () => {
        if (!lodash.isUndefined(config_1.environment)) {
            console.log("Env: " + config_1.environment.name + " Port: " + config_1.environment.httpPort);
        }
    });
    const httpsServerOptions = {
        cert: fs.readFileSync("./.ssl/cert.pem"),
        key: fs.readFileSync("./.ssl/key.pem"),
    };
    // tslint:disable-next-line:max-line-length
    const httpsServer = https.createServer(httpsServerOptions, (request, response) => {
        server_1.server.handler(request, response);
    });
    httpsServer.listen(config_1.environment.httpsPort, () => {
        if (!lodash.isUndefined(config_1.environment)) {
            console.log("Env: " + config_1.environment.name + " Port: " + config_1.environment.httpsPort);
        }
    });
}
