"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const checks_1 = require("../business/checks");
const tokens_1 = require("../business/tokens");
const users_1 = require("../business/users");
const helpers_1 = require("../lib/helpers");
exports.routeHandler = {
    notFound: (data, callback) => {
        callback(404);
    },
    ping: (data, callback) => {
        callback(200);
    },
    tokens: (data, callback) => {
        const acceptableMethodsMap = new Map();
        acceptableMethodsMap.set("post", exports.routeHandler._tokens.post);
        acceptableMethodsMap.set("get", exports.routeHandler._tokens.get);
        acceptableMethodsMap.set("put", exports.routeHandler._tokens.put);
        acceptableMethodsMap.set("delete", exports.routeHandler._tokens.delete);
        exports.routeHandler._handler(data, acceptableMethodsMap, callback);
    },
    users: (data, callback) => {
        const acceptableMethodsMap = new Map();
        acceptableMethodsMap.set("post", exports.routeHandler._users.post);
        acceptableMethodsMap.set("get", exports.routeHandler._users.get);
        acceptableMethodsMap.set("put", exports.routeHandler._users.put);
        acceptableMethodsMap.set("delete", exports.routeHandler._users.delete);
        const token = lodash.pick(data.headers, ["token"]);
        token.phone = 33201025;
        tokens_1.tokens.verifyToken(token, (statusCode, payload) => {
            if (statusCode === 200) {
                exports.routeHandler._handler(data, acceptableMethodsMap, callback);
            }
            else {
                callback(statusCode, payload);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    checks: (data, callback) => {
        const acceptableMethodsMap = new Map();
        acceptableMethodsMap.set("post", exports.routeHandler._checks.post);
        acceptableMethodsMap.set("get", exports.routeHandler._checks.get);
        acceptableMethodsMap.set("put", exports.routeHandler._checks.put);
        acceptableMethodsMap.set("delete", exports.routeHandler._checks.delete);
        const token = lodash.pick(data.headers, ["token"]);
        token.phone = 33201025;
        tokens_1.tokens.verifyToken(token, (statusCode, payload) => {
            if (statusCode === 200) {
                exports.routeHandler._handler(data, acceptableMethodsMap, callback);
            }
            else {
                callback(statusCode, payload);
            }
        });
    },
    // tslint:disable-next-line:max-line-length
    _handler(data, acceptableMethodsMap, callback) {
        // tslint:disable-next-line:variable-name
        let _function;
        if (!lodash.isUndefined(acceptableMethodsMap.get(data.method))) {
            _function = acceptableMethodsMap.get(data.method);
        }
        else {
            callback(405);
        }
        data.payload = helpers_1.helpers.parseJsonToObject(data.payload);
        _function(data, (statusCode, payload) => {
            callback(statusCode, payload);
        });
    },
    _tokens: {
        post: (data, callback) => {
            const token = lodash.pick(data.payload, ["phone", "password"]);
            tokens_1.tokens.insert(token, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        // tslint:disable-next-line:object-literal-sort-keys
        get: (data, callback) => {
            const token = lodash.pick(data.query, ["token"]);
            tokens_1.tokens.select(token, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        put: (data, callback) => {
            const token = lodash.pick(data.payload, ["token", "expires"]);
            tokens_1.tokens.update(token, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        delete: (data, callback) => {
            const token = lodash.pick(data.query, ["token"]);
            tokens_1.tokens.delete(token, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        }
    },
    // tslint:disable-next-line:object-literal-sort-keys
    _users: {
        post: (data, callback) => {
            // tslint:disable-next-line:max-line-length
            const user = lodash.pick(data.payload, ["firstName", "lastName", "phone", "password", "tosAgreement"]);
            users_1.users.insert(user, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        // tslint:disable-next-line:object-literal-sort-keys
        get: (data, callback) => {
            users_1.users.select(33201025, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        put: (data, callback) => {
            // tslint:disable-next-line:max-line-length
            const user = lodash.pick(data.payload, ["firstName", "lastName", "phone", "password", "tosAgreement"]);
            users_1.users.update(user, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        delete: (data, callback) => {
            users_1.users.delete(33201025, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        }
    },
    _checks: {
        post: (data, callback) => {
            // tslint:disable-next-line:max-line-length
            const check = lodash.pick(data.payload, ["protocol", "url", "method", "successCodes", "timeoutSeconds"]);
            checks_1.checks.insert(check, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        // tslint:disable-next-line:object-literal-sort-keys
        get: (data, callback) => {
            const check = lodash.pick(data.query, ["id"]);
            checks_1.checks.select(check, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        put: (data, callback) => {
        },
        delete: (data, callback) => {
        },
    }
};
exports.routesMap = new Map();
exports.routesMap.set("ping", exports.routeHandler.ping);
exports.routesMap.set("users", exports.routeHandler.users);
exports.routesMap.set("tokens", exports.routeHandler.tokens);
exports.routesMap.set("checks", exports.routeHandler.checks);
