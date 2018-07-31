import * as lodash from "lodash";
import { checks } from "../business/checks";
import { tokens } from "../business/tokens";
import { users } from "../business/users";
import { ApiData, Check, RouteHandler, Token, User } from "../lib/definitions";
import { helpers } from "../lib/helpers";
import { validators } from "../lib/validations";

export const api = {
    notFound: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {
        callback(404);
    },
    ping: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {
        callback(200);
    },
    tokens: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

        const acceptableMethodsMap = new Map<string, any>();
        acceptableMethodsMap.set("post", api._tokens.post);
        acceptableMethodsMap.set("get", api._tokens.get);
        acceptableMethodsMap.set("put", api._tokens.put);
        acceptableMethodsMap.set("delete", api._tokens.delete);

        api._handler(data, acceptableMethodsMap, callback);
    },
    users: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

        const acceptableMethodsMap = new Map<string, any>();
        acceptableMethodsMap.set("post", api._users.post);
        acceptableMethodsMap.set("get", api._users.get);
        acceptableMethodsMap.set("put", api._users.put);
        acceptableMethodsMap.set("delete", api._users.delete);

        if (data.method !== "post") {

            const token: Token = lodash.pick(data.headers, ["token"]) as Token;
            token.phone = 33201025;

            tokens.verifyToken(token, (statusCode: number, payload?: object | string) => {

                if (statusCode === 200) {
                    api._handler(data, acceptableMethodsMap, callback);
                } else {
                    callback(statusCode, payload);
                }
            });
        } else {
            api._handler(data, acceptableMethodsMap, callback);
        }
    },
    // tslint:disable-next-line:object-literal-sort-keys
    checks: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

        const acceptableMethodsMap = new Map<string, any>();
        acceptableMethodsMap.set("post", api._checks.post);
        acceptableMethodsMap.set("get", api._checks.get);
        acceptableMethodsMap.set("put", api._checks.put);
        acceptableMethodsMap.set("delete", api._checks.delete);

        const token: Token = lodash.pick(data.headers, ["token"]) as Token;
        token.phone = 33201025;

        tokens.verifyToken(token, (statusCode: number, payload?: object | string) => {

            if (statusCode === 200) {
                api._handler(data, acceptableMethodsMap, callback);
            } else {
                callback(statusCode, payload);
            }
        });
    },
    // tslint:disable-next-line:max-line-length
    _handler(data: ApiData, acceptableMethodsMap: Map<string, any>, callback: (statusCode: number, payload?: object | string) => void) {

        // tslint:disable-next-line:variable-name
        let _function: any | undefined;
        if (!lodash.isUndefined(acceptableMethodsMap.get(data.method))) {
            _function = acceptableMethodsMap.get(data.method);
        } else {
            callback(405);
        }
        data.payload = helpers.parseJsonToObject(data.payload as string) as object;
        _function(data, (statusCode: number, payload?: object | string) => {
            callback(statusCode, payload);
        });
    },

    _tokens: {
        post: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const token: Token = lodash.pick(data.payload, ["phone", "password"]) as Token;
            tokens.insert(token, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        // tslint:disable-next-line:object-literal-sort-keys
        get: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const token: Token = lodash.pick(data.query, ["token"]) as Token;
            tokens.select(token, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        put: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const token: Token = lodash.pick(data.payload, ["token", "expires"]) as Token;
            tokens.update(token, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        delete: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {
            const token: Token = lodash.pick(data.query, ["token"]) as Token;
            tokens.delete(token, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        }
    },
    // tslint:disable-next-line:object-literal-sort-keys
    _users: {
        post: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            // tslint:disable-next-line:max-line-length
            const user: User = lodash.pick(data.payload, ["firstName", "lastName", "phone", "password", "tosAgreement"]) as User;
            users.insert(user, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        // tslint:disable-next-line:object-literal-sort-keys
        get: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const user: any = lodash.pick(data.query, ["phone"]) as any;
            users.select(user.phone, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        put: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            // tslint:disable-next-line:max-line-length
            const user: User = lodash.pick(data.payload, ["firstName", "lastName", "phone", "password", "tosAgreement"]) as User;
            users.update(user, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        delete: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const user: any = lodash.pick(data.query, ["phone"]) as any;
            users.delete(user.phone, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        }
    },
    _checks: {
        post: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            // tslint:disable-next-line:max-line-length
            const check: Check = lodash.pick(data.payload, ["protocol", "url", "method", "successCodes", "timeoutSeconds"]) as Check;
            check.phone = 33201025;
            checks.insert(check, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        // tslint:disable-next-line:object-literal-sort-keys
        get: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const check: Check = lodash.pick(data.query, ["id"]) as Check;
            checks.select(check, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });

        },
        put: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            // tslint:disable-next-line:max-line-length
            const check: Check = lodash.pick(data.payload, ["id", "protocol", "url", "method", "successCodes", "timeoutSeconds"]) as Check;
            check.phone = 33201025;
            checks.update(check, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
        delete: (data: ApiData, callback: (statusCode: number, payload?: object | string) => void) => {

            const check: Check = lodash.pick(data.query, ["id"]) as Check;
            check.phone = 33201025;
            checks.delete(check, (statusCode: number, payload?: object | string) => {
                callback(statusCode, payload);
            });
        },
    }
};

export const apiMap: Map<string, any> = new Map<string, any>();
apiMap.set("ping", api.ping);
apiMap.set("users", api.users);
apiMap.set("tokens", api.tokens);
apiMap.set("checks", api.checks);
