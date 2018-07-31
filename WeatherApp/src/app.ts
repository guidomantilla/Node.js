import * as lodash from "lodash";

import { Argv } from "./cli/cli-cmd";
import * as googleMaps from "./google/maps";
import { GeocodeAddress } from "./google/maps";

import * as darksky from "./darksky/darksky";
import { Forecast } from "./darksky/darksky";

const key: string = "227d7e1d79ecc982d25f319b6c0a0d05";

const command = Argv._[0];
try {

    if (!lodash.isUndefined(Argv.address)) {

        googleMaps.fetchGeocode(Argv.address, (geocodeError: string | undefined, geocode: GeocodeAddress | undefined) => {

            if (!lodash.isUndefined(geocodeError)) {
                console.log(geocodeError);

            } else {
                if (!lodash.isUndefined(geocode)) {

                    console.log(geocode.formatted_address);

                    darksky.forecast(key, geocode.latitude, geocode.longitude,
                        (forecastError: string | undefined, forecast: Forecast | undefined) => {

                            if (!lodash.isUndefined(forecastError)) {
                                console.log(forecastError);

                            } else {
                                console.log(forecast);
                            }
                        });
                }
            }
        });
    }


} catch (e) {
    const error = e as Error;
    console.log(error.message);
}

