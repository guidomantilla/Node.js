import * as lodash from "lodash";
import { environment } from "../config";
import { dao } from "../dao";
import { Check, Environment, Token, User } from "../lib/definitions";
import { helpers } from "../lib/helpers";
import { validators } from "../lib/validations";
import { users } from "./users";

export const checks = {

    // tslint:disable-next-line:object-literal-sort-keys
    insert: (check: Check, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!validators.number("" + check.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validators.string(check.protocol, 1)) {
            callback(400, "Protocol is not a String");
            return;
        }
        if (!validators.string(check.url, 1)) {
            callback(400, "Url is not a String");
            return;
        }
        if (!validators.string(check.method, 1)) {
            callback(400, "Method is not a String");
            return;
        }
        if (!lodash.isObject(check.successCodes) || !lodash.isArray(check.successCodes)) {
            callback(400, "Success Codes is not a Array");
            return;
        }
        if (!validators.number("" + check.timeoutSeconds)) {
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
        dao.select("users", "" + check.phone, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200 && !lodash.isUndefined(environment)) {

                const user = payloadSel as User;
                if (lodash.isUndefined(user.checks)) {
                    user.checks = [];
                }
                if (user.checks.length < environment.maxChecks) {

                    check.id = helpers.createRandomString(20) as string;
                    dao.insert("checks", check, (statusCodeIns: number, payloadIns?: object | string) => {

                        if (statusCodeIns === 200 && !lodash.isUndefined(user.checks)) {
                            user.checks.push(check.id);

                            // tslint:disable-next-line:max-line-length
                            users.update(user, (statusCodeUpd: number, payloadUpd?: string | object | undefined) => {
                                callback(statusCodeUpd, payloadUpd);
                            });

                        } else {
                            callback(statusCodeIns, payloadIns);
                        }
                    });

                } else {
                    callback(400, "The user already has the maximum number of checks " + environment.maxChecks);
                }
            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    update: (check: Check, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(check.id) && !validators.string(check.id as string, 20)) {
            callback(400, "ID is not a String");
            return;
        }
        if (!validators.number("" + check.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validators.string(check.protocol, 1)) {
            callback(400, "Protocol is not a String");
            return;
        }
        if (!validators.string(check.url, 1)) {
            callback(400, "Url is not a String");
            return;
        }
        if (!validators.string(check.method, 1)) {
            callback(400, "Method is not a String");
            return;
        }
        if (!lodash.isObject(check.successCodes) || !lodash.isArray(check.successCodes)) {
            callback(400, "Success Codes is not a Array");
            return;
        }
        if (!validators.number("" + check.timeoutSeconds)) {
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
        dao.select("checks", check.id as string, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                const checkUpd = payloadSel as Check;
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

                dao.update("checks", checkUpd, (statusCodeUpd: number, payloadUpd?: object | string) => {
                    callback(statusCodeUpd, payloadUpd);
                });

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (check: Check, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(check.id) && !validators.string(check.id as string, 20)) {
            callback(400, "ID is not a String");
            return;
        }

        // tslint:disable-next-line:max-line-length
        dao.select("checks", check.id as string, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                dao.delete("checks", check.id as string, (statusCodeDel: number, payloadDel?: object | string) => {
                    //callback(statusCodeDel, payloadDel);

                    if (statusCodeDel === 200) {                
                        console.log(check);
                        users.select(check.phone, (statusCodeSel1: number, payloadSel1?: object | string) => {

                            if (statusCodeSel1 === 200) {

                                const user = payloadSel1 as User;
                                if (!lodash.isUndefined(user.checks)) {

                                    const pos = user.checks.indexOf(check.id);
                                    user.checks.splice(pos, 1);

                                    users.update(user, (statusCodeUpd: number, payloadUpd?: object | string) => {
                                        callback(statusCodeUpd, payloadUpd);
                                    });
                                }
                            } else {
                                callback(statusCodeSel1, payloadSel1);
                            }
                        });
                    } else {
                        callback(statusCodeDel, payloadDel);
                    }
                });
            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    select: (check: Check, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(check.id) && !validators.string(check.id as string, 20)) {
            callback(400, "ID is not a String");
            return;
        }

        dao.select("checks", check.id, (statusCodeSel: number, payloadSel?: object | string) => {
            callback(statusCodeSel, payloadSel);
        });
    }
};