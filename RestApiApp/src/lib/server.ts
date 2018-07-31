import * as http from "http";
import * as lodash from "lodash";
import * as querystring from "querystring";
import * as stringDecoder from "string_decoder";
import * as url from "url";
import { api, apiMap } from "../api";
import { ApiData } from "../lib/definitions";

export const server = {

    handler: (request: http.IncomingMessage, response: http.ServerResponse) => {

        if (!lodash.isUndefined(request.url)) {
            const parsedUrl = url.parse(request.url, true);
            const path = parsedUrl.pathname;
            const trimmedPath = !lodash.isUndefined(path) ? path.replace(/^\/+|\/+$/g, "") : "";

            const queryString = parsedUrl.query;
            const method = !lodash.isUndefined(request.method) ? request.method.toLowerCase() : "";
            const headers = request.headers;

            const decoder = new stringDecoder.StringDecoder("utf-8");

            let buffer: string = "";
            request.on("data", (chunk: Buffer | string) => {
                if (Buffer.isBuffer(chunk)) {
                    buffer += decoder.write(new Buffer(chunk));
                } else {
                    buffer += decoder.write(new Buffer(chunk));
                }
            });
            request.on("end", () => {
                buffer += decoder.end();
                const data: ApiData = {
                    headers,
                    method,
                    path: trimmedPath,
                    payload: buffer,
                    query: queryString
                };

                console.log(trimmedPath, queryString);
                let routeFunction: any | undefined = api.notFound;
                if (!lodash.isUndefined(apiMap.get(trimmedPath))) {
                    routeFunction = apiMap.get(trimmedPath);
                }

                routeFunction(data, (statusCode: number, payload?: object) => {

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