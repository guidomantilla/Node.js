"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const checks_1 = require("../business/checks");
const tokens_1 = require("../business/tokens");
const users_1 = require("../business/users");
const helpers_1 = require("../lib/helpers");
exports.api = {
    notFound: (data, callback) => {
        callback(404);
    },
    ping: (data, callback) => {
        callback(200);
    },
    tokens: (data, callback) => {
        const acceptableMethodsMap = new Map();
        acceptableMethodsMap.set("post", exports.api._tokens.post);
        acceptableMethodsMap.set("get", exports.api._tokens.get);
        acceptableMethodsMap.set("put", exports.api._tokens.put);
        acceptableMethodsMap.set("delete", exports.api._tokens.delete);
        exports.api._handler(data, acceptableMethodsMap, callback);
    },
    users: (data, callback) => {
        const acceptableMethodsMap = new Map();
        acceptableMethodsMap.set("post", exports.api._users.post);
        acceptableMethodsMap.set("get", exports.api._users.get);
        acceptableMethodsMap.set("put", exports.api._users.put);
        acceptableMethodsMap.set("delete", exports.api._users.delete);
        if (data.method !== "post") {
            const token = lodash.pick(data.headers, ["token"]);
            token.phone = 33201025;
            tokens_1.tokens.verifyToken(token, (statusCode, payload) => {
                if (statusCode === 200) {
                    exports.api._handler(data, acceptableMethodsMap, callback);
                }
                else {
                    callback(statusCode, payload);
                }
            });
        }
        else {
            exports.api._handler(data, acceptableMethodsMap, callback);
        }
    },
    // tslint:disable-next-line:object-literal-sort-keys
    checks: (data, callback) => {
        const acceptableMethodsMap = new Map();
        acceptableMethodsMap.set("post", exports.api._checks.post);
        acceptableMethodsMap.set("get", exports.api._checks.get);
        acceptableMethodsMap.set("put", exports.api._checks.put);
        acceptableMethodsMap.set("delete", exports.api._checks.delete);
        const token = lodash.pick(data.headers, ["token"]);
        token.phone = 33201025;
        tokens_1.tokens.verifyToken(token, (statusCode, payload) => {
            if (statusCode === 200) {
                exports.api._handler(data, acceptableMethodsMap, callback);
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
            const user = lodash.pick(data.query, ["phone"]);
            users_1.users.select(user.phone, (statusCode, payload) => {
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
            const user = lodash.pick(data.query, ["phone"]);
            users_1.users.delete(user.phone, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        }
    },
    _checks: {
        post: (data, callback) => {
            // tslint:disable-next-line:max-line-length
            const check = lodash.pick(data.payload, ["protocol", "url", "method", "successCodes", "timeoutSeconds"]);
            check.phone = 33201025;
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
            // tslint:disable-next-line:max-line-length
            const check = lodash.pick(data.payload, ["id", "protocol", "url", "method", "successCodes", "timeoutSeconds"]);
            check.phone = 33201025;
            checks_1.checks.update(check, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
        delete: (data, callback) => {
            const check = lodash.pick(data.query, ["id"]);
            check.phone = 33201025;
            checks_1.checks.delete(check, (statusCode, payload) => {
                callback(statusCode, payload);
            });
        },
    }
};
exports.apiMap = new Map();
exports.apiMap.set("ping", exports.api.ping);
exports.apiMap.set("users", exports.api.users);
exports.apiMap.set("tokens", exports.api.tokens);
exports.apiMap.set("checks", exports.api.checks);
