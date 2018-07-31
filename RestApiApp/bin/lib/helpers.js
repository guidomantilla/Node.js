"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const lodash = require("lodash");
const config_1 = require("../config");
const validations_1 = require("../lib/validations");
exports.helpers = {
    nameof: (name) => name,
    hash: (text) => {
        let hash;
        if (!lodash.isUndefined(config_1.environment)) {
            if (lodash.isString(text) && text.length > 0) {
                hash = crypto.createHmac("sha256", config_1.environment.secret).update(text).digest("hex");
            }
        }
        return hash;
    },
    parseJsonToObject: (json) => {
        let obj;
        try {
            obj = JSON.parse(json);
        }
        catch (e) {
        }
        return obj;
    },
    // tslint:disable-next-line:object-literal-sort-keys
    createRandomString: (strLength) => {
        let randomString = "";
        if (validations_1.validators.number("" + strLength)) {
            const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 1; i <= strLength; i++) {
                // tslint:disable-next-line:max-line-length
                const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                randomString += randomCharacter;
            }
        }
        return randomString;
    },
    createExpireDate: () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return date;
    }
};
