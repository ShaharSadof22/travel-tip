import { storServie } from './storage.service.js'

export const mapService = {
    connectGoogleApi,
    addLocation,
    deleteLoc,
    getLocations,
    getDefPos
}

const DEFAULT_LAT = 29.55805;
const DEFAULT_LNG = 34.94821;
const LOCS_KEY = "LOCATIONS";
var locations = storServie.loadFromStorage(LOCS_KEY);
_addDefaultLoc();



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

function addLocation(pos, name) {
    const location = {
        id: _makeId(),
        pos: {
            lat: parseFloat(pos.lat).toFixed(4),
            lng: parseFloat(pos.lng).toFixed(4)
        },
        name: name,
        createdAt: new Date(Date.now()).toLocaleString()
    }
    locations.push(location);
    _saveLocations();
}


function _addDefaultLoc() {
    if (!locations) {
        let defLoc = {
            id: _makeId(),
            pos: {
                lat: DEFAULT_LAT,
                lng: DEFAULT_LNG
            },
            name: 'EYLAT',
            createdAt: new Date(Date.now()).toLocaleString()
        }
        locations = [];
        locations.push(defLoc);
    }
}

function deleteLoc(locId){
    let deleteIdx = locations.findIndex (loc => loc.id === locId);
    locations.splice(deleteIdx,1);
    _saveLocations();
}

function getLocations() {
    return locations;
}

function getDefPos() {
    return { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
}

function _saveLocations() {
    storServie.saveToStorage(LOCS_KEY, locations);
}


function _makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
