"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
exports.validators = {
    boolean: (text) => {
        if (lodash.isUndefined(text) || lodash.isNull(text)) {
            return false;
        }
        if (text.toLowerCase() !== "true" && text.toLowerCase() !== "false") {
            return false;
        }
        return true;
    },
    number: (text) => {
        if (lodash.isUndefined(text) || lodash.isNull(text)) {
            return false;
        }
        if (lodash.isNaN(lodash.toNumber(text))) {
            return false;
        }
        return true;
    },
    string: (text, minLength) => {
        if (lodash.isUndefined(text) || lodash.isNull(text)) {
            return false;
        }
        if (!lodash.isString(text)) {
            return false;
        }
        if (text.trim().length < minLength) {
            return false;
        }
        return true;
    },
};
