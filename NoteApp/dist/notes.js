"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var dataFolderPath = "./data";
var jsonFilename = "notes.json";
var jsonFullPath = dataFolderPath + "/" + jsonFilename;
function _fixDataFolder() {
    var existDataFolderPath = fs.existsSync(dataFolderPath);
    if (!existDataFolderPath) {
        fs.mkdirSync(dataFolderPath);
    }
    var existJsonFullPath = fs.existsSync(jsonFullPath);
    if (!existJsonFullPath) {
        fs.writeFileSync(jsonFullPath, "");
    }
}
function fetchData() {
    var dataArray = [];
    var dataArrayString = fs.readFileSync(jsonFullPath);
    if (dataArrayString.toString() !== "") {
        dataArray = JSON.parse(dataArrayString.toString());
    }
    return dataArray;
}
function saveData(dataArray) {
    fs.writeFileSync(jsonFullPath, JSON.stringify(dataArray));
}
function addNote(note) {
    _fixDataFolder();
    var noteArray = fetchData();
    var filteredNoteArray = noteArray.filter(function (noteItem) {
        return note.title === noteItem.title;
    });
    var returnNote;
    if (filteredNoteArray.length === 0) {
        noteArray.push(note);
        saveData(noteArray);
        returnNote = note;
    }
    return returnNote;
}
exports.addNote = addNote;
function getAll() {
    _fixDataFolder();
    var noteArray = fetchData();
    return noteArray;
}
exports.getAll = getAll;
function getNote(note) {
    _fixDataFolder();
    var noteArray = fetchData();
    var filteredNoteArray = noteArray.filter(function (noteItem) {
        return note.title === noteItem.title;
    });
    var returnNote;
    if (filteredNoteArray.length !== 0) {
        returnNote = filteredNoteArray[0];
    }
    return returnNote;
}
exports.getNote = getNote;
function removeNote(note) {
    _fixDataFolder();
    var noteArray = fetchData();
    var filteredNoteArray = noteArray.filter(function (noteItem) {
        return note.title !== noteItem.title;
    });
    var returnNote;
    if (filteredNoteArray.length !== noteArray.length) {
        saveData(filteredNoteArray);
        returnNote = note;
    }
    return returnNote;
}
exports.removeNote = removeNote;
