import * as fs from "fs";
import * as lodash from "lodash";

import { Argv } from "./command";
import * as notes from "./notes";
import { Note } from "./notes";

const command = Argv._[0];
//console.log(Argv);

try {
    if (command === "add") {

        let note: Note | undefined = {
            title: Argv.title,
            body: Argv.body,
        };

        note = notes.addNote(note);
        if (lodash.isUndefined(note)) {
            throw new Error("Note title taken.");
        } else {
            console.log("Note Created.", note);
        }

    } else if (command === "list") {

        const noteArray = notes.getAll();
        if (!lodash.isUndefined(noteArray)) {
            console.log("Note List.", noteArray);
        }

    } else if (command === "read") {

        let note: Note | undefined = {
            title: Argv.title,
            body: "",
        };

        note = notes.getNote(note);
        if (lodash.isUndefined(note)) {
            throw new Error("Note not found.");
        } else {
            console.log("Note.", note);
        }

    } else if (command === "remove") {

        let note: Note | undefined = {
            title: Argv.title,
            body: "",
        };

        note = notes.removeNote(note);
        if (lodash.isUndefined(note)) {
            throw new Error("Note not found.");
        } else {
            console.log("Note was Removed.", note);
        }

    } else {

        throw new Error("Command not valid!!");
    }

} catch (e) {
    const error = e as Error;
    console.log(error.message);
}
