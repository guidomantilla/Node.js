import * as crypto from "crypto";
import * as lodash from "lodash";
import { environment } from "../config";
import { Environment } from "../lib/definitions";
import { validators } from "../lib/validations";

export const helpers = {

    nameof: <T>(name: keyof T) => name,

    hash: (text: string): string | undefined => {

        let hash: string | undefined;
        if (!lodash.isUndefined(environment)) {
            if (lodash.isString(text) && text.length > 0) {
                hash = crypto.createHmac("sha256", environment.secret).update(text).digest("hex");
            }
        }
        return hash;
    },
    parseJsonToObject: (json: string): object | undefined => {
        let obj: object | undefined;
        try {
            obj = JSON.parse(json);
        } catch (e) {
        }
        return obj;
    },
    // tslint:disable-next-line:object-literal-sort-keys
    createRandomString: (strLength: number): string | undefined => {

        let randomString = "";
        if (validators.number("" + strLength)) {

            const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

            for (let i = 1; i <= strLength; i++) {

                // tslint:disable-next-line:max-line-length
                const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                randomString += randomCharacter as string;
            }
        }

        return randomString;
    },
    createExpireDate: (): Date => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        return date;
    }
};

