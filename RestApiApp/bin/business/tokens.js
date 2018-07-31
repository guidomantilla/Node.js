"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const dao_1 = require("../dao");
const helpers_1 = require("../lib/helpers");
const validations_1 = require("../lib/validations");
exports.tokens = {
    insert: (token, callback) => {
        if (!lodash.isUndefined(token.phone) && !validations_1.validators.number("" + token.phone)) {
            callback(400, "Phone is not a String");
            return;
        }
        if (!lodash.isUndefined(token.password) && !validations_1.validators.string(token.password, 1)) {
            callback(400, "Password is not a String");
            return;
        }
        dao_1.dao.select("users", "" + token.phone, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                const user = payloadSel;
                const hashedPassword = helpers_1.helpers.hash(token.password);
                if (hashedPassword === user.password) {
                    token.token = helpers_1.helpers.createRandomString(20);
                    token.expires = helpers_1.helpers.createExpireDate().getTime();
                    token.password = hashedPassword;
                    dao_1.dao.insert("tokens", token, (statusCodeIns, payloadIns) => {
                        callback(statusCodeIns, payloadIns);
                    });
                }
                else {
                    callback(400, "Password did not match the specified user\'s stored password");
                }
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    update: (token, callback) => {
        if (!lodash.isUndefined(token.token) && !validations_1.validators.string(token.token, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        if (!lodash.isUndefined(token.expires) && !validations_1.validators.number("" + token.expires)) {
            callback(400, "Expire is not a Number");
            return;
        }
        dao_1.dao.select("tokens", token.token, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                if (token.expires > Date.now()) {
                    token.expires = helpers_1.helpers.createExpireDate().getTime();
                    dao_1.dao.update("tokens", token, (statusCodeUpd, payloadUpd) => {
                        callback(statusCodeUpd, payloadUpd);
                    });
                }
                else {
                    callback(400, "The token has already expired, and cannot be extended.");
                }
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (token, callback) => {
        if (!lodash.isUndefined(token.token) && !validations_1.validators.string(token.token, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        dao_1.dao.select("tokens", token.token, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                dao_1.dao.delete("tokens", token.token, (statusCodeDel, payloadDel) => {
                    callback(statusCodeDel, payloadDel);
                });
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    select: (token, callback) => {
        if (!lodash.isUndefined(token.token) && !validations_1.validators.string(token.token, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        dao_1.dao.select("tokens", token.token, (statusCode, payload) => {
            callback(statusCode, payload);
        });
    },
    verifyToken: (token, callback) => {
        if (!lodash.isUndefined(token.token) && !validations_1.validators.string(token.token, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        if (!lodash.isUndefined(token.expires) && !validations_1.validators.number("" + token.expires)) {
            callback(400, "Expire is not a Number");
            return;
        }
        if (!lodash.isUndefined(token.phone) && !validations_1.validators.number("" + token.phone)) {
            callback(400, "Phone is not a String");
            return;
        }
        // tslint:disable-next-line:max-line-length
        dao_1.dao.select("tokens", token.token, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                const savedToken = payloadSel;
                savedToken.phone = Number(savedToken.phone);
                const now = Date.now();
                if (token.phone === savedToken.phone && savedToken.expires > now) {
                    callback(statusCodeSel, payloadSel);
                }
                else {
                    callback(501, "Token no valido");
                }
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    }
};
