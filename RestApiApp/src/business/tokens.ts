import * as lodash from "lodash";
import { dao } from "../dao";
import { Token, User } from "../lib/definitions";
import { helpers } from "../lib/helpers";
import { validators } from "../lib/validations";

export const tokens = {

    insert: (token: Token, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(token.phone) && !validators.number("" + token.phone)) {
            callback(400, "Phone is not a String");
            return;
        }
        if (!lodash.isUndefined(token.password) && !validators.string(token.password as string, 1)) {
            callback(400, "Password is not a String");
            return;
        }

        dao.select("users", "" + token.phone, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                const user = payloadSel as User;
                const hashedPassword = helpers.hash(token.password as string);
                if (hashedPassword === user.password) {

                    token.token = helpers.createRandomString(20);
                    token.expires = helpers.createExpireDate().getTime();
                    token.password = hashedPassword;

                    dao.insert("tokens", token, (statusCodeIns: number, payloadIns?: object | string) => {
                        callback(statusCodeIns, payloadIns);
                    });

                } else {                    
                    callback(400, "Password did not match the specified user\'s stored password");
                }

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    update: (token: Token, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(token.token) && !validators.string(token.token as string, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        if (!lodash.isUndefined(token.expires) && !validators.number("" + token.expires)) {
            callback(400, "Expire is not a Number");
            return;
        }

        dao.select("tokens", token.token as string, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                if (token.expires as number > Date.now()) {

                    token.expires = helpers.createExpireDate().getTime();

                    dao.update("tokens", token, (statusCodeUpd: number, payloadUpd?: object | string) => {
                        callback(statusCodeUpd, payloadUpd);
                    });
                } else {
                    callback(400, "The token has already expired, and cannot be extended.");
                }

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (token: Token, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(token.token) && !validators.string(token.token as string, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        dao.select("tokens", token.token as string, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                dao.delete("tokens", token.token as string, (statusCodeDel: number, payloadDel?: object | string) => {
                    callback(statusCodeDel, payloadDel);
                });

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    select: (token: Token, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(token.token) && !validators.string(token.token as string, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        dao.select("tokens", token.token as string, (statusCode: number, payload?: object | string) => {
            callback(statusCode, payload);
        });
    },
    verifyToken: (token: Token, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!lodash.isUndefined(token.token) && !validators.string(token.token as string, 20)) {
            callback(400, "Token is not a String");
            return;
        }
        if (!lodash.isUndefined(token.expires) && !validators.number("" + token.expires)) {
            callback(400, "Expire is not a Number");
            return;
        }
        if (!lodash.isUndefined(token.phone) && !validators.number("" + token.phone)) {
            callback(400, "Phone is not a String");
            return;
        }
        // tslint:disable-next-line:max-line-length
        dao.select("tokens", token.token as string, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                const savedToken = payloadSel as Token;
                savedToken.phone = Number(savedToken.phone);
                const now = Date.now();

                if (token.phone === savedToken.phone && savedToken.expires as number > now) {
                    callback(statusCodeSel, payloadSel);
                } else {
                    callback(501, "Token no valido");
                }
            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    }
};