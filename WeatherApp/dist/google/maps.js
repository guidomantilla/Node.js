"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const request = require("request");
function fetchGeocode(address, callerCallback) {
    const encodedAddress = encodeURIComponent(address);
    const requestOptions = {
        url: `http://maps.google.com/maps/api/geocode/json?address=${encodedAddress}`,
        //url: "http://localhost:8080", //set the ERROR object
        json: true,
    };
    request.get(requestOptions, (error, response, body) => {
        if (!lodash.isNull(error)) {
            callerCallback("Unable to connect to Google Server.", undefined);
        }
        else if (body.status === "ZERO_RESULTS") {
            callerCallback("Unable to find the address.", undefined);
        }
        else if (body.status === "OK") {
            callerCallback(undefined, {
                formatted_address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng,
            });
        }
    });
}
exports.fetchGeocode = fetchGeocode;
