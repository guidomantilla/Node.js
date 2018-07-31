"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const cli_cmd_1 = require("./cli/cli-cmd");
const googleMaps = require("./google/maps.1");
const darksky = require("./darksky/darksky.1");
const key = "227d7e1d79ecc982d25f319b6c0a0d05";
const command = cli_cmd_1.Argv._[0];
try {
    if (!lodash.isUndefined(cli_cmd_1.Argv.address)) {
        googleMaps.fetchGeocode(cli_cmd_1.Argv.address)
            .then((geocode) => {
            console.log(geocode.formatted_address);
            return darksky.forecast(key, geocode.latitude, geocode.longitude);
        })
            .then((forecast) => {
            console.log(forecast.temperature);
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
catch (e) {
    const error = e;
    console.log(error.message);
}
