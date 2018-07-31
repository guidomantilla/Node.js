import * as fs from "fs";

const dataFolderPath = "./data";
const jsonFilename = "notes.json";
const jsonFullPath = dataFolderPath + "/" + jsonFilename;

export interface Note {
    title: string;
    body: string;
}

function _fixDataFolder(): void {
    const existDataFolderPath: boolean = fs.existsSync(dataFolderPath);
    if (!existDataFolderPath) {
        fs.mkdirSync(dataFolderPath);
    }

    const existJsonFullPath: boolean = fs.existsSync(jsonFullPath);
    if (!existJsonFullPath) {
        fs.writeFileSync(jsonFullPath, "");
    }
}

function fetchData<T>(): T[] {
    let dataArray: T[] = [];

    const dataArrayString = fs.readFileSync(jsonFullPath);
    if (dataArrayString.toString() !== "") {
        dataArray = JSON.parse(dataArrayString.toString());
    }

    return dataArray;
}

function saveData<T>(dataArray: T[]) {

    fs.writeFileSync(jsonFullPath, JSON.stringify(dataArray));
}

export function addNote(note: Note): Note | undefined {

    _fixDataFolder();

    const noteArray: Note[] = fetchData<Note>();
    const filteredNoteArray: Note[] = noteArray.filter((noteItem: Note) => {
        return note.title === noteItem.title;
    });


    let returnNote: Note | undefined;
    if (filteredNoteArray.length === 0) {
        noteArray.push(note);
        saveData<Note>(noteArray);
        returnNote = note;
    }

    return returnNote;
}

export function getAll(): Note[] {

    _fixDataFolder();

    const noteArray: Note[] = fetchData<Note>();

    return noteArray;
}

export function getNote(note: Note): Note | undefined {

    _fixDataFolder();

    const noteArray: Note[] = fetchData<Note>();
    const filteredNoteArray: Note[] = noteArray.filter((noteItem: Note) => {
        return note.title === noteItem.title;
    });

    let returnNote: Note | undefined;
    if (filteredNoteArray.length !== 0) {
        returnNote = filteredNoteArray[0];
    }

    return returnNote;
}

export function removeNote(note: Note): Note | undefined {

    _fixDataFolder();

    const noteArray: Note[] = fetchData<Note>();
    const filteredNoteArray: Note[] = noteArray.filter((noteItem: Note) => {
        return note.title !== noteItem.title;
    });

    let returnNote: Note | undefined;
    if (filteredNoteArray.length !== noteArray.length) {
        saveData<Note>(filteredNoteArray);
        returnNote = note;
    }

    return returnNote;
}