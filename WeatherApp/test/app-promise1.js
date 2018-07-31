const lodash = require("lodash");
const request = require("request");

var geocodeAddres = (address) => {
    return new Promise((resolve, reject) => {

        var encodedAddress = encodeURIComponent(address);
        var requestOptions = {
            url: `http://maps.google.com/maps/api/geocode/json?address=${encodedAddress}`,
            //url: "http://localhost:8080", //set the ERROR object
            json: true,
        };

        request.get(requestOptions, (error, response, body) => {

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
};

var forecast = (key, latitude, longitude) => {
    return new Promise((resolve, reject) => {

        var requestOptions = {
            url: `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`,
            //url: "http://localhost:8080", //set the ERROR object
            json: true,
        };

        request.get(requestOptions, (error, response, body) => {

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
};


geocodeAddres("000000")
    .then((success) => {
        console.log(success.formatted_address);


        var key = "227d7e1d79ecc982d25f319b6c0a0d05";
        return forecast(key, success.latitude, success.longitude);

    }).then((success) => {
        console.log(success);

    }).catch((error) => {
        console.log(error);
    });