import * as http from "http";
import * as querystring from "querystring";

export interface Environment {
    name: string;
    secret: string;
    httpPort: number;
    httpsPort: number;
    maxChecks: number;
}

export interface RouteHandler {
    data: ApiData;
    callback: (statusCode: number, payload?: object) => void;
}

export interface ApiData {
    headers: http.IncomingHttpHeaders;
    method: string;
    path: string;
    payload: object | string;
    query: querystring.ParsedUrlQuery;
}

export interface User {
    firstName: string;
    lastName: string;
    phone: number;
    password: string;
    tosAgreement: boolean;
    checks?: string[];
}

export interface Token {
    token?: string;
    phone?: number;
    password?: string;
    expires?: number;
}

export interface Check {
    id: string;
    phone: number;
    protocol: string;
    url: string;
    method: string;
    successCodes: object[];
    timeoutSeconds: number;
}