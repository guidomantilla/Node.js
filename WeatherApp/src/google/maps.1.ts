
import * as lodash from "lodash";
import * as request from "request";

import { RequestResponse } from "request";


export interface GeocodeAddress {

    formatted_address: string;
    latitude: number;
    longitude: number;
}

interface RequestBody {
    results: any[];
    status: string;
}

export function fetchGeocode(address: string): Promise<GeocodeAddress> {

    const promise = new Promise<GeocodeAddress>((resolve, reject) => {

        const encodedAddress = encodeURIComponent(address);
        const requestOptions = {
            url: `http://maps.google.com/maps/api/geocode/json?address=${encodedAddress}`,
            //url: "http://localhost:8080", //set the ERROR object
            json: true,
        };

        request.get(requestOptions,
            (error: any, response: RequestResponse, body: RequestBody) => {

                if (!lodash.isNull(error)) {
                    reject("Unable to connect to Google Server.");

                } else if (body.status === "ZERO_RESULTS") {
                    reject("Unable to find the address.");

                } else if (body.status === "OK") {
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