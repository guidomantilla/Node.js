"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const stringDecoder = require("string_decoder");
const url = require("url");
const api_1 = require("../api");
exports.server = {
    handler: (request, response) => {
        if (!lodash.isUndefined(request.url)) {
            const parsedUrl = url.parse(request.url, true);
            const path = parsedUrl.pathname;
            const trimmedPath = !lodash.isUndefined(path) ? path.replace(/^\/+|\/+$/g, "") : "";
            const queryString = parsedUrl.query;
            const method = !lodash.isUndefined(request.method) ? request.method.toLowerCase() : "";
            const headers = request.headers;
            const decoder = new stringDecoder.StringDecoder("utf-8");
            let buffer = "";
            request.on("data", (chunk) => {
                if (Buffer.isBuffer(chunk)) {
                    buffer += decoder.write(new Buffer(chunk));
                }
                else {
                    buffer += decoder.write(new Buffer(chunk));
                }
            });
            request.on("end", () => {
                buffer += decoder.end();
                const data = {
                    headers,
                    method,
                    path: trimmedPath,
                    payload: buffer,
                    query: queryString
                };
                console.log(trimmedPath, queryString);
                let routeFunction = api_1.api.notFound;
                if (!lodash.isUndefined(api_1.apiMap.get(trimmedPath))) {
                    routeFunction = api_1.apiMap.get(trimmedPath);
                }
                routeFunction(data, (statusCode, payload) => {
                    statusCode = lodash.isNumber(statusCode) ? statusCode : 200;
                    const json = JSON.stringify({ payload });
                    console.log(statusCode, json);
                    response.statusCode = statusCode;
                    response.setHeader("Content-Type", "application/json");
                    response.end(json);
                });
            });
        }
    },
};
