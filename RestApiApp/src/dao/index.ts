import * as lodash from "lodash";
import { data } from "../lib/data";
import { User } from "../lib/definitions";
import { helpers } from "../lib/helpers";

const daoMap: Map<any, any> = new Map<any, any>();
daoMap.set("users", "phone");
daoMap.set("tokens", "token");
daoMap.set("checks", "id");

const retriveTableKey = (table: string): string|number => {
    return helpers.nameof(daoMap.get(table));
};

export const dao = {

    insert: (table: string, obj: any, callback: (statusCode: number, payload?: object | string) => void) => {

        const key = retriveTableKey(table);
        data.create(table, obj[key], obj, (message: string | undefined) => {

            if (lodash.isUndefined(message)) {
                callback(200, obj);
            } else {
                callback(500, message);
            }
        });
    },
    update: (table: string, obj: any, callback: (statusCode: number, payload?: object | string) => void) => {

        const key = retriveTableKey(table);
        data.update(table, obj[key], obj, (message: string | undefined) => {

            if (lodash.isUndefined(message)) {
                callback(200, obj);
            } else {
                callback(500, message);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (table: string, key: string, callback: (statusCode: number, payload?: object | string) => void) => {

        data.delete(table, key, (message: string | undefined, obj?: object | string | undefined) => {

            if (lodash.isUndefined(message)) {
                callback(200, obj);
            } else {
                callback(500, message);
            }
        });

    },
    select: (table: string, key: string, callback: (statusCode: number, payload?: object | string) => void) => {

        data.read(table, key, (message: string | undefined, obj?: object | string | undefined) => {

            if (lodash.isUndefined(message)) {
                callback(200, obj);
            } else {
                callback(500, message);
            }
        });
    }
};