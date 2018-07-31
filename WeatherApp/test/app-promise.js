var asyncAdd = (a, b) => {
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if (typeof a === "number" && typeof b === "number") {

                resolve(a + b);

            } else {

                reject("Arguments must be numbers");
            }

        }, 1500);
    });
};


asyncAdd(3, "6")
    .then((success) => {
        console.log(success);

        return asyncAdd(success, 5);

    }).then((success) => {
        console.log(success);
        
    }).catch((error) => {
        console.log(error);
    });



var somePromise = new Promise((resolve, reject) => {

    setTimeout(() => {
        //resolve("OK");
        reject("BAD");
    }, 2500);
});

somePromise.then(
    (success) => {
        console.log(success);
    },
    (error) => {
        console.log(error);
    });