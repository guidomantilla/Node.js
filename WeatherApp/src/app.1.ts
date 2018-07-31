import * as lodash from "lodash";

import { Argv } from "./cli/cli-cmd";
import * as googleMaps from "./google/maps.1";
import { GeocodeAddress } from "./google/maps.1";

import * as darksky from "./darksky/darksky.1";
import { Forecast } from "./darksky/darksky.1";

const key: string = "227d7e1d79ecc982d25f319b6c0a0d05";

const command = Argv._[0];
try {

    if (!lodash.isUndefined(Argv.address)) {

        googleMaps.fetchGeocode(Argv.address)
            .then((geocode: GeocodeAddress) => {

                console.log(geocode.formatted_address);
                return darksky.forecast(key, geocode.latitude, geocode.longitude);
            })
            .then((forecast: Forecast) => {

                console.log(forecast.temperature);
            })
            .catch((error: string) => {

                console.log(error);
            });
    }


} catch (e) {
    const error = e as Error;
    console.log(error.message);
}

