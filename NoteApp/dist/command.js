"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var titleConfig = {
    describe: "Title of note",
    demand: true,
};
var bodyConfig = {
    describe: "Body of note",
    demand: true,
};
exports.Argv = yargs
    .command("add", "Add a New Note", {
    title: titleConfig,
    body: bodyConfig,
})
    .command("list", "List of Notes", {})
    .command("read", "read a Note", {
    title: titleConfig,
})
    .command("remove", "Remove a Note", {
    title: titleConfig,
})
    .help()
    .argv;
