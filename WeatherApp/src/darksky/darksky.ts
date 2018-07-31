
import * as lodash from "lodash";
import * as request from "request";

import { RequestResponse } from "request";


export interface Forecast {

    temperature: number;
}

export interface CallerCallback {
    (error: string | undefined, data: Forecast | undefined): void;
}

export function forecast(key: string, latitude: number, longitude: number, callerCallback: CallerCallback) {

    const requestOptions = {
        url: `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`,
        //url: "http://localhost:8080", //set the ERROR object
        json: true,
    };

    request.get(requestOptions,
        (error: any, response: RequestResponse, body: any) => {

            if (!lodash.isNull(error)) {
                callerCallback("Unable to connect to Dark Sky Server.", undefined);

            } else if (response.statusCode !== 200) {
                callerCallback("Unable to fecth wather", undefined);

            } else if (response.statusCode === 200) {
                callerCallback(undefined, {
                    temperature: body.currently.temperature,
                });
            }
        });
}