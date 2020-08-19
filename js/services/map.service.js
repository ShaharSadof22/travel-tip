
export const mapService = {
    initMap,
    addMarker,
    panTo,
}

var map;

export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', map);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'YOU ARE HERE!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    map.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = ''; //TODO: Enter your API Key
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
// const DEFAULT_LAT = 29.55805;
// const DEFAULT_LNG = 34.94821;
// const LOCS_KEY = "LOCATIONS";
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