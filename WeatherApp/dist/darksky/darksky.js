"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const request = require("request");
function forecast(key, latitude, longitude, callerCallback) {
    const requestOptions = {
        url: `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`,
        //url: "http://localhost:8080", //set the ERROR object
        json: true,
    };
    request.get(requestOptions, (error, response, body) => {
        if (!lodash.isNull(error)) {
            callerCallback("Unable to connect to Dark Sky Server.", undefined);
        }
        else if (response.statusCode !== 200) {
            callerCallback("Unable to fecth wather", undefined);
        }
        else if (response.statusCode === 200) {
            callerCallback(undefined, {
                temperature: body.currently.temperature,
            });
        }
    });
}
exports.forecast = forecast;
