"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("../dao");
const helpers_1 = require("../lib/helpers");
const validations_1 = require("../lib/validations");
exports.users = {
    insert: (user, callback) => {
        if (!validations_1.validators.string(user.firstName, 1)) {
            callback(400, "FirstName is not a String");
            return;
        }
        if (!validations_1.validators.string(user.lastName, 1)) {
            callback(400, "LastName is not a String");
            return;
        }
        if (!validations_1.validators.number("" + user.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validations_1.validators.string(user.password, 8)) {
            callback(400, "Password is not a String");
            return;
        }
        if (!validations_1.validators.boolean("" + user.tosAgreement)) {
            callback(400, "TosAgreement is not a Boolean");
            return;
        }
        const hashedPassword = helpers_1.helpers.hash(user.password);
        user.password = hashedPassword;
        dao_1.dao.select("users", "" + user.phone, (statusCodeSel, payloadSel) => {
            if (statusCodeSel !== 200) {
                dao_1.dao.insert("users", user, (statusCodeIns, payloadIns) => {
                    callback(statusCodeIns, payloadIns);
                });
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    update: (user, callback) => {
        if (!validations_1.validators.string(user.firstName, 1)) {
            callback(400, "FirstName is not a String");
            return;
        }
        if (!validations_1.validators.string(user.lastName, 1)) {
            callback(400, "LastName is not a String");
            return;
        }
        if (!validations_1.validators.number("" + user.phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        if (!validations_1.validators.string(user.password, 8)) {
            callback(400, "Password is not a String");
            return;
        }
        if (!validations_1.validators.boolean("" + user.tosAgreement)) {
            callback(400, "TosAgreement is not a Boolean");
            return;
        }
        dao_1.dao.select("users", "" + user.phone, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                dao_1.dao.update("users", user, (statusCodeUpd, payloadUpd) => {
                    callback(statusCodeUpd, payloadUpd);
                });
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (phone, callback) => {
        if (!validations_1.validators.number("" + phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        dao_1.dao.select("users", "" + phone, (statusCodeSel, payloadSel) => {
            if (statusCodeSel === 200) {
                dao_1.dao.delete("users", "" + phone, (statusCodeDel, payloadDel) => {
                    callback(statusCodeDel, payloadDel);
                });
            }
            else {
                callback(statusCodeSel, payloadSel);
            }
        });
    },
    select: (phone, callback) => {
        if (!validations_1.validators.number("" + phone)) {
            callback(400, "Phone is not a Number");
            return;
        }
        dao_1.dao.select("users", "" + phone, (statusCode, payload) => {
            callback(statusCode, payload);
        });
    },
};
