"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const stagging = {
    httpPort: 3000,
    httpsPort: 3001,
    maxChecks: 5,
    name: "stagging",
    secret: "thisIsASecret",
};
const production = {
    httpPort: 5000,
    httpsPort: 5001,
    maxChecks: 5,
    name: "production",
    secret: "thisIsASecret",
};
const environmentMap = new Map();
environmentMap.set("stagging", stagging);
environmentMap.set("production", production);
let environmentKey = "";
if (lodash.isString(process.env.NODE_ENV)) {
    environmentKey = process.env.NODE_ENV.toLowerCase();
}
exports.environment = stagging;
if (lodash.isObject(environmentMap.get(environmentKey))) {
    exports.environment = environmentMap.get(environmentKey);
}
