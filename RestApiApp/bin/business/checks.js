"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const config_1 = require("../config");
const dao_1 = require("../dao");
const helpers_1 = require("../lib/helpers");
const validations_1 = require("../lib/validations");
const users_1 = require("./users");
exports.checks = {
    // tslint:disable-next-line:object-literal-sort-keys
    insert: (check, callback) => {
        if (!validations_1.validators.number("" + check.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validations_1.validators.string(check.protocol, 1)) {
            callback(400, "Protocol is not a String");
            return;
        }
        if (!validations_1.validators.string(check.url, 1)) {
            callback(400, "Url is not a String");
            return;
        }
        if (!validations_1.validators.string(check.method, 1)) {
            callback(400, "Method is not a String");
            return;
        }
        if (!lodash.isObject(check.successCodes) || !lodash.isArray(check.successCodes)) {
            callback(400, "Success Codes is not a Array");
            return;
        }
        if (!validations_1.validators.number("" + check.timeoutSeconds)) {
            callback(400, "Timeout is not a Number");
            return;
        }
        if (["https", "http"].indexOf(check.protocol) < 0) {
            callback(400, "Protocol invalid");
            return;
        }
        if (["post", "get", "put", "delete"].indexOf(check.method) < 0) {
            callback(400, "Method invalid");
            return;
        }
        //data.payload.successCodes.length > 0
        //data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5
        dao_1.dao.select("users", "" + check.phone, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200 && !lodash.isUndefined(config_1.environment)) {
                const user = payloadSel;
                if (lodash.isUndefined(user.checks)) {
                    user.checks = [];
                }
                if (user.checks.length < config_1.environment.maxChecks) {
                    check.id = helpers_1.helpers.createRandomString(20);
                    dao_1.dao.insert("checks", check, (statusCodeIns, payloadIns) => {
                        if (statusCodeIns === 200 && !lodash.isUndefined(user.checks)) {
                            user.checks.push(check.id);
                            // tslint:disable-next-line:max-line-length
                            users_1.users.update(user, (statusCodeUpd, payloadUpd) => {
                                callback(statusCodeUpd, payloadUpd);
                            });
                        }
                        else {
                            callback(statusCodeIns, payloadIns);
                        }
                    });
                }
                else {
                    callback(400, "The user already has the maximum number of checks " + config_1.environment.maxChecks);
                }
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    update: (check, callback) => {
        if (!lodash.isUndefined(check.id) && !validations_1.validators.string(check.id, 20)) {
            callback(400, "ID is not a String");
            return;
        }
        if (!validations_1.validators.number("" + check.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validations_1.validators.string(check.protocol, 1)) {
            callback(400, "Protocol is not a String");
            return;
        }
        if (!validations_1.validators.string(check.url, 1)) {
            callback(400, "Url is not a String");
            return;
        }
        if (!validations_1.validators.string(check.method, 1)) {
            callback(400, "Method is not a String");
            return;
        }
        if (!lodash.isObject(check.successCodes) || !lodash.isArray(check.successCodes)) {
            callback(400, "Success Codes is not a Array");
            return;
        }
        if (!validations_1.validators.number("" + check.timeoutSeconds)) {
            callback(400, "Timeout is not a Number");
            return;
        }
        if (["https", "http"].indexOf(check.protocol) < 0) {
            callback(400, "Protocol invalid");
            return;
        }
        if (["post", "get", "put", "delete"].indexOf(check.method) < 0) {
            callback(400, "Method invalid");
            return;
        }
        // Este metodo debe fallar si no se envian datos para actualizar
        // if(protocol || url || method || successCodes || timeoutSeconds){
        dao_1.dao.select("checks", check.id, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                const checkUpd = payloadSel;
                if (check.protocol) {
                    checkUpd.protocol = check.protocol;
                }
                if (check.url) {
                    checkUpd.url = check.url;
                }
                if (check.method) {
                    checkUpd.method = check.method;
                }
                if (check.successCodes) {
                    checkUpd.successCodes = check.successCodes;
                }
                if (check.timeoutSeconds) {
                    checkUpd.timeoutSeconds = check.timeoutSeconds;
                }
                dao_1.dao.update("checks", checkUpd, (statusCodeUpd, payloadUpd) => {
                    callback(statusCodeUpd, payloadUpd);
                });
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (check, callback) => {
        if (!lodash.isUndefined(check.id) && !validations_1.validators.string(check.id, 20)) {
            callback(400, "ID is not a String");
            return;
        }
        // tslint:disable-next-line:max-line-length
        dao_1.dao.select("checks", check.id, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                dao_1.dao.delete("checks", check.id, (statusCodeDel, payloadDel) => {
                    //callback(statusCodeDel, payloadDel);
                    if (statusCodeDel === 200) {
                        console.log(check);
                        users_1.users.select(check.phone, (statusCodeSel1, payloadSel1) => {
                            if (statusCodeSel1 === 200) {
                                const user = payloadSel1;
                                if (!lodash.isUndefined(user.checks)) {
                                    const pos = user.checks.indexOf(check.id);
                                    user.checks.splice(pos, 1);
                                    users_1.users.update(user, (statusCodeUpd, payloadUpd) => {
                                        callback(statusCodeUpd, payloadUpd);
                                    });
                                }
                            }
                            else {
                                callback(statusCodeSel1, payloadSel1);
                            }
                        });
                    }
                    else {
                        callback(statusCodeDel, payloadDel);
                    }
                });
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    select: (check, callback) => {
        if (!lodash.isUndefined(check.id) && !validations_1.validators.string(check.id, 20)) {
            callback(400, "ID is not a String");
            return;
        }
        dao_1.dao.select("checks", check.id, (statusCodeSel, payloadSel) => {
            callback(statusCodeSel, payloadSel);
        });
    }
};
