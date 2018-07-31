"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
exports.Argv = yargs
    .options({
    address: {
        describe: "Address to fecth weather for",
        demand: true,
        string: true,
    },
})
    .help()
    .argv;
