"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash = require("lodash");
var command_1 = require("./command");
var notes = require("./notes");
var command = command_1.Argv._[0];
//console.log(Argv);
try {
    if (command === "add") {
        var note = {
            title: command_1.Argv.title,
            body: command_1.Argv.body,
        };
        note = notes.addNote(note);
        if (lodash.isUndefined(note)) {
            throw new Error("Note title taken.");
        }
        else {
            console.log("Note Created.", note);
        }
    }
    else if (command === "list") {
        var noteArray = notes.getAll();
        if (!lodash.isUndefined(noteArray)) {
            console.log("Note List.", noteArray);
        }
    }
    else if (command === "read") {
        var note = {
            title: command_1.Argv.title,
            body: "",
        };
        note = notes.getNote(note);
        if (lodash.isUndefined(note)) {
            throw new Error("Note not found.");
        }
        else {
            console.log("Note.", note);
        }
    }
    else if (command === "remove") {
        var note = {
            title: command_1.Argv.title,
            body: "",
        };
        note = notes.removeNote(note);
        if (lodash.isUndefined(note)) {
            throw new Error("Note not found.");
        }
        else {
            console.log("Note was Removed.", note);
        }
    }
    else {
        throw new Error("Command not valid!!");
    }
}
catch (e) {
    var error = e;
    console.log(error.message);
}
