
import * as lodash from "lodash";
import * as request from "request";

import { RequestResponse } from "request";


export interface Forecast {

    temperature: number;
}

export function forecast(key: string, latitude: number, longitude: number): Promise<Forecast> {

    const promise = new Promise<Forecast>((resolve, reject) => {

        const requestOptions = {
            url: `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`,
            //url: "http://localhost:8080", //set the ERROR object
            json: true,
        };

        request.get(requestOptions,
            (error: any, response: RequestResponse, body: any) => {

                if (!lodash.isNull(error)) {
                    reject("Unable to connect to Dark Sky Server.");

                } else if (response.statusCode !== 200) {
                    reject("Unable to fecth wather");

                } else if (response.statusCode === 200) {
                    resolve({
                        temperature: body.currently.temperature,
                    });
                }
            });
    });

    return promise;
}