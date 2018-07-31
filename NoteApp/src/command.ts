import * as yargs from "yargs";

const titleConfig = {
    describe: "Title of note",
    demand: true,
};
const bodyConfig = {
    describe: "Body of note",
    demand: true,
};

export const Argv = yargs
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
