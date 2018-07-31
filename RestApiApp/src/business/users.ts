import * as lodash from "lodash";
import { dao } from "../dao";
import { User } from "../lib/definitions";
import { helpers } from "../lib/helpers";
import { validators } from "../lib/validations";

export const users = {

    insert: (user: User, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!validators.string(user.firstName, 1)) {
            callback(400, "FirstName is not a String");
            return;
        }
        if (!validators.string(user.lastName, 1)) {
            callback(400, "LastName is not a String");
            return;
        }
        if (!validators.number("" + user.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validators.string(user.password, 8)) {
            callback(400, "Password is not a String");
            return;
        }
        if (!validators.boolean("" + user.tosAgreement)) {
            callback(400, "TosAgreement is not a Boolean");
            return;
        }

        const hashedPassword = helpers.hash(user.password);
        user.password = hashedPassword as string;

        dao.select("users", "" + user.phone, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel !== 200) {
                dao.insert("users", user, (statusCodeIns: number, payloadIns?: object | string) => {
                    callback(statusCodeIns, payloadIns);
                });

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    update: (user: User, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!validators.string(user.firstName, 1)) {
            callback(400, "FirstName is not a String");
            return;
        }
        if (!validators.string(user.lastName, 1)) {
            callback(400, "LastName is not a String");
            return;
        }
        if (!validators.number("" + user.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validators.string(user.password, 8)) {
            callback(400, "Password is not a String");
            return;
        }
        if (!validators.boolean("" + user.tosAgreement)) {
            callback(400, "TosAgreement is not a Boolean");
            return;
        }

        dao.select("users", "" + user.phone, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                dao.update("users", user, (statusCodeUpd: number, payloadUpd?: object | string) => {
                    callback(statusCodeUpd, payloadUpd);
                });

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (phone: number, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!validators.number("" + phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        dao.select("users", "" + phone, (statusCodeSel: number, payloadSel?: object | string) => {

            if (statusCodeSel === 200) {

                dao.delete("users", "" + phone, (statusCodeDel: number, payloadDel?: object | string) => {
                    callback(statusCodeDel, payloadDel);
                });

            } else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    select: (phone: number, callback: (statusCode: number, payload?: object | string) => void) => {

        if (!validators.number("" + phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        dao.select("users", "" + phone, (statusCode: number, payload?: object | string) => {
            callback(statusCode, payload);
        });
    },
};