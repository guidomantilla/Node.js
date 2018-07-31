import * as lodash from "lodash";
import { Environment } from "./lib/definitions";

const stagging: Environment = {
    httpPort: 3000,
    httpsPort: 3001,
    maxChecks: 5,
    name: "stagging",
    secret: "thisIsASecret",   
};
const production: Environment = {
    httpPort: 5000,
    httpsPort: 5001,
    maxChecks: 5,
    name: "production",
    secret: "thisIsASecret",
};

const environmentMap: Map<string, Environment> = new Map<string, Environment>();
environmentMap.set("stagging", stagging);
environmentMap.set("production", production);

let environmentKey: string = "";
if (lodash.isString(process.env.NODE_ENV)) {
    environmentKey = process.env.NODE_ENV.toLowerCase();
}

export let environment: Environment | undefined = stagging;
if (lodash.isObject(environmentMap.get(environmentKey))) {
    environment = environmentMap.get(environmentKey);
}