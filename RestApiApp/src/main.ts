import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as lodash from "lodash";
import { environment } from "./config";
import { Environment } from "./lib/definitions";
import { server } from "./lib/server";

if (!lodash.isUndefined(environment)) {

    const httpServer = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
        server.handler(request, response);
    });
    httpServer.listen(environment.httpPort, () => {
        if (!lodash.isUndefined(environment)) {
            console.log("Env: " + environment.name + " Port: " + environment.httpPort);
        }
    });

    const httpsServerOptions = {
        cert: fs.readFileSync("./.ssl/cert.pem"),
        key: fs.readFileSync("./.ssl/key.pem"),
    };
    // tslint:disable-next-line:max-line-length
    const httpsServer = https.createServer(httpsServerOptions, (request: http.IncomingMessage, response: http.ServerResponse) => {
        server.handler(request, response);
    });
    httpsServer.listen(environment.httpsPort, () => {
        if (!lodash.isUndefined(environment)) {
            console.log("Env: " + environment.name + " Port: " + environment.httpsPort);
        }
    });
}