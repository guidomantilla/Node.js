"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const request = require("request");
function fetchGeocode(address) {
    const promise = new Promise((resolve, reject) => {
        const encodedAddress = encodeURIComponent(address);
        const requestOptions = {
            url: `http://maps.google.com/maps/api/geocode/json?address=${encodedAddress}`,
            //url: "http://localhost:8080", //set the ERROR object
            json: true,
        };
        request.get(requestOptions, (error, response, body) => {
            if (!lodash.isNull(error)) {
                reject("Unable to connect to Google Server.");
            }
            else if (body.status === "ZERO_RESULTS") {
                reject("Unable to find the address.");
            }
            else if (body.status === "OK") {
                resolve({
                    formatted_address: body.results[0].formatted_address,
                    latitude: body.results[0].geometry.location.lat,
                    longitude: body.results[0].geometry.location.lng,
                });
            }
        });
    });
    return promise;
}
exports.fetchGeocode = fetchGeocode;
