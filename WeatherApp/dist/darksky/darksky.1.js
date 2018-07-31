"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const request = require("request");
function forecast(key, latitude, longitude) {
    const promise = new Promise((resolve, reject) => {
        const requestOptions = {
            url: `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`,
            //url: "http://localhost:8080", //set the ERROR object
            json: true,
        };
        request.get(requestOptions, (error, response, body) => {
            if (!lodash.isNull(error)) {
                reject("Unable to connect to Dark Sky Server.");
            }
            else if (response.statusCode !== 200) {
                reject("Unable to fecth wather");
            }
            else if (response.statusCode === 200) {
                resolve({
                    temperature: body.currently.temperature,
                });
            }
        });
    });
    return promise;
}
exports.forecast = forecast;
