
export const mapService = {
    connectGoogleApi,
    getCurrPos
}

const DEFAULT_LAT = 29.55805;
const DEFAULT_LNG = 34.94821;
const LOCS_KEY = "LOCATIONS";



function getCurrPos() {
    return gCurrPoss;
}

function connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDGql0MyVMEQeH89LQj0TtpM66SoLpkAhw&callback'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



// 'use strict';

// var gLocations = loadFromStorage(LOCS_KEY);
// _addDefaultLoc();

// function addLocation(pos, name) {
//     let location = {
//         id: makeId(),
//         pos: {
//             lat: parseFloat(pos.lat).toFixed(4),
//             lng: parseFloat(pos.lng).toFixed(4)
//         },
//         name: name
//     }
//     gLocations.push(location);
//     _saveLocations();
// }

// function _addDefaultLoc() {
//     if (!gLocations) {
//         let defLoc = {
//             id: makeId(),
//             pos: {
//                 lat: DEFAULT_LAT,
//                 lng: DEFAULT_LNG
//             },
//             name: 'EYLAT'
//         }
//         gLocations = [];
//         gLocations.push(defLoc);
//     }
// }

// function deleteLoc(locId){
//     let deleteIdx = gLocations.findIndex (loc => loc.id === locId);
//     gLocations.splice(deleteIdx,1);
//     _saveLocations();
// }

// function getLocations() {
//     return gLocations;
// }

// function getDefPos() {
//     return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
// }

// function _saveLocations() {
//     saveToStorage(LOCS_KEY, gLocations);
// }