import * as yargs from "yargs";

export const Argv = yargs
    .options({
        address: {
            describe: "Address to fecth weather for",
            demand: true,
            string: true,
        },
    })
    .help()
    .argv;
