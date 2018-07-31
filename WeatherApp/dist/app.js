"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const cli_cmd_1 = require("./cli/cli-cmd");
const googleMaps = require("./google/maps");
const darksky = require("./darksky/darksky");
const key = "227d7e1d79ecc982d25f319b6c0a0d05";
const command = cli_cmd_1.Argv._[0];
try {
    if (!lodash.isUndefined(cli_cmd_1.Argv.address)) {
        googleMaps.fetchGeocode(cli_cmd_1.Argv.address, (geocodeError, geocode) => {
            if (!lodash.isUndefined(geocodeError)) {
                console.log(geocodeError);
            }
            else {
                if (!lodash.isUndefined(geocode)) {
                    console.log(geocode.formatted_address);
                    darksky.forecast(key, geocode.latitude, geocode.longitude, (forecastError, forecast) => {
                        if (!lodash.isUndefined(forecastError)) {
                            console.log(forecastError);
                        }
                        else {
                            console.log(forecast);
                        }
                    });
                }
            }
        });
    }
}
catch (e) {
    const error = e;
    console.log(error.message);
}
