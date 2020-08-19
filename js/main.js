console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(() => {

            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .then(addEventsListeners)
        .catch(err => {
            console.log('Cannot get user-position', err);
        })
}

function addEventsListeners(){
    map.addListener('click', function (mapsMouseEvent) {
        var pos = {
            lat: mapsMouseEvent.latLng.lat(),
            lng: mapsMouseEvent.latLng.lng()
        };
        var isDoInit = onMapClick(pos);
        if (isDoInit) map.setCenter(pos.lat, pos.lng);

    });

    renderLocations();
}


function onMapClick(pos) {
    $('.modal').modal('show');
    gCurrentClick = pos;
}

function onAddLocation() {
    var name = $('.input-modal').val();
    $('.input-modal').val('');
    if (name) {
        addLocation(gCurrentClick, name);
        renderLocations();
        return true;
    }
    return false;
}

function onRemoveLoc(locId) {
    deleteLoc(locId);
    renderLocations();
}


document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    mapService.panTo(35.6895, 139.6917);
})
