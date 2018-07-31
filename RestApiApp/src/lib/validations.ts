import * as lodash from "lodash";

export const validators = {

    boolean: (text: string): boolean => {

        if (lodash.isUndefined(text) || lodash.isNull(text)) {
            return false;
        }

        if (text.toLowerCase() !== "true" && text.toLowerCase() !== "false") {
            return false;
        }

        return true;
    },
    number: (text: string): boolean => {

        if (lodash.isUndefined(text) || lodash.isNull(text)) {
            return false;
        }

        if (lodash.isNaN(lodash.toNumber(text))) {
            return false;
        }

        return true;
    },
    string: (text: string, minLength: number): boolean => {

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