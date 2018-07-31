
import * as lodash from "lodash";
import * as request from "request";

import { RequestResponse } from "request";


export interface GeocodeAddress {

    formatted_address: string;
    latitude: number;
    longitude: number;
}

export interface CallerCallback {
    (error: string | undefined, data: GeocodeAddress | undefined): void;
}

interface RequestBody {
    results: any[];
    status: string;
}

export function fetchGeocode(address: string, callerCallback: CallerCallback): void {

    const encodedAddress = encodeURIComponent(address);
    const requestOptions = {
        url: `http://maps.google.com/maps/api/geocode/json?address=${encodedAddress}`,
        //url: "http://localhost:8080", //set the ERROR object
        json: true,
    };

    request.get(requestOptions,
        (error: any, response: RequestResponse, body: RequestBody) => {

            if (!lodash.isNull(error)) {
                callerCallback("Unable to connect to Google Server.", undefined);

            } else if (body.status === "ZERO_RESULTS") {
                callerCallback("Unable to find the address.", undefined);

            } else if (body.status === "OK") {
                callerCallback(undefined, {
                    formatted_address: body.results[0].formatted_address,
                    latitude: body.results[0].geometry.location.lat,
                    longitude: body.results[0].geometry.location.lng,
                });
            }
        });
}