console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

var map;
var currPos;

window.onload = () => {
    initMap(mapService.getDefPos().lat, mapService.getDefPos().lng)
        .then(() => {
            addMarker({ lat: mapService.getDefPos().lat, lng: mapService.getDefPos().lng });
            panTo({ lat: mapService.getDefPos().lat, lng: mapService.getDefPos().lng });
        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })
        .then(renderLocations())
}


function renderLocations() {
    var locations = mapService.getLocations();
    var htmlLocStr = locations.map(loc => {
        return `<tr> <td class="loc-name" id="loc-${loc.id}_${loc.pos.lat}_${loc.pos.lng}">${loc.name}</td>
         <td class="loc-pos">${loc.pos.lat},\ ${loc.pos.lng} </td> 
         <td><button class="delete-loc" id="${loc.id}">X</button></td></tr>`;
    });
    $('.loc-table tbody').html(htmlLocStr.join(''));
    addEventListeners();
}


function addEventListeners() {
    const elSaveLocBtn = document.querySelector('#save-btn');
    elSaveLocBtn.addEventListener("click", () => onAddLocation());

    document.querySelectorAll('.loc-name').forEach(loc => {
        loc.addEventListener('click', event => {
            const loc = event.toElement.id.split('_');
            initMap(parseFloat(loc[1]), parseFloat(loc[2]))
        })
    })

    document.querySelectorAll('.delete-loc').forEach(loc => {
        loc.addEventListener('click', event => {
            const delLoc = event.toElement.id;
            onRemoveLoc(delLoc);
        })
    })
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return mapService.connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', map);
        })
        .then(() => {
            map.addListener('click', function (mapsMouseEvent) {
                currPos = {
                    lat: mapsMouseEvent.latLng.lat(),
                    lng: mapsMouseEvent.latLng.lng()
                };
                map.setCenter(currPos);
                addMarker(currPos.lat, currPos.lng);
                panTo(currPos.lat, currPos.lng);
                onMapClick(currPos);
            })
        })
}

function addMarker(loc) {
    const marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'YOU ARE HERE!'
    });
    return marker;
}

function panTo(lat, lng) {
    const laLatLng = new google.maps.LatLng(lat, lng);
    map.panTo(laLatLng);
}

locService.getLocs()
    .then(locs => console.log('locs', locs))



function onMapClick() {
    $('.modal').modal('show');

}

function onAddLocation() {
    var name = $('.input-modal').val();
    $('.input-modal').val('');
    if (name) {
        mapService.addLocation(currPos, name);
        renderLocations();
        return true;
    }
    return false;
}

function onRemoveLoc(locId) {
    mapService.deleteLoc(locId);
    renderLocations();
}
