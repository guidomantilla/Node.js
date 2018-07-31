"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_handlebars = require("express-handlebars");
const filesystem = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const port = process.env.PORT || 3000;
const app = express();
/* Aca obtengo el framework como tal*/
const hbs = handlebars;
hbs.registerHelper("getYear", () => {
    return new Date().getFullYear();
});
hbs.registerHelper("screamIt", (text) => {
    console.log(text);
    let str = "";
    if (typeof text !== "undefined") {
        str = text.toUpperCase();
    }
    return str;
});
/* Aca obtengo el wrapper del framework*/
const exphbs = express_handlebars({
    handlebars: hbs,
    defaultLayout: "layout",
    helpers: hbs.helpers,
});
app.use((request, response, next) => {
    const now = new Date();
    const log = `${now.toISOString()}: ${request.method} ${request.url}\n`;
    console.log(log);
    filesystem.appendFile("server.log", log, (error) => {
        if (error) {
            console.log("Unable to append to server.log");
        }
    });
    next();
});
const options = {
    dotfiles: "ignore",
    etag: false,
    xtensions: ["html"],
    index: false,
};
app.use(express.static(path.join(__dirname, "public"), options));
/*
app.use((request: Request, response: Response, next: NextFunction) => {
    response.render("maintenance");
});
*/
app.engine("handlebars", exphbs);
app.set("view engine", "handlebars");
app.get("/", (request, response) => {
    response.render("home", {
        title: "Home Page",
        welcomeMessage: "Welcome to the Jungle",
    });
});
app.get("/about", (request, response) => {
    response.render("about", {
        title: "About Page",
    });
});
app.get("/project", (request, response) => {
    response.render("project", {
        title: "Project Page",
    });
});
app.listen(port, () => {
    console.log("Server its up!!");
});
