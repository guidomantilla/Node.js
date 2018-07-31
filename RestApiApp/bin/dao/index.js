"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const data_1 = require("../lib/data");
const helpers_1 = require("../lib/helpers");
const daoMap = new Map();
daoMap.set("users", "phone");
daoMap.set("tokens", "token");
daoMap.set("checks", "id");
const retriveTableKey = (table) => {
    return helpers_1.helpers.nameof(daoMap.get(table));
};
exports.dao = {
    insert: (table, obj, callback) => {
        const key = retriveTableKey(table);
        data_1.data.create(table, obj[key], obj, (message) => {
            if (lodash.isUndefined(message)) {
                callback(200, obj);
            }
            else {
                callback(500, message);
            }
        });
    },
    update: (table, obj, callback) => {
        const key = retriveTableKey(table);
        data_1.data.update(table, obj[key], obj, (message) => {
            if (lodash.isUndefined(message)) {
                callback(200, obj);
            }
            else {
                callback(500, message);
            }
        });
    },
    // tslint:disable-next-line:object-literal-sort-keys
    delete: (table, key, callback) => {
        data_1.data.delete(table, key, (message, obj) => {
            if (lodash.isUndefined(message)) {
                callback(200, obj);
            }
            else {
                callback(500, message);
            }
        });
    },
    select: (table, key, callback) => {
        data_1.data.read(table, key, (message, obj) => {
            if (lodash.isUndefined(message)) {
                callback(200, obj);
            }
            else {
                callback(500, message);
            }
        });
    }
};
