
export const locService = {
    getLocs,
    getPosition,
    getLocationByName
}
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getPosition() {

    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve)
        } else {
            reject('addMarker on MAP ERROR');
        }
    })
}

function getLocationByName(userSearch) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${userSearch}&key=AIzaSyDGql0MyVMEQeH89LQj0TtpM66SoLpkAhw&callback`)
        .then(res => res.data)
}
