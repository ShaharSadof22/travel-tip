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
        .then(renderLocations())
        .then(() => {
            addListenerMyLocation()
            addListenerSearchLocation()
        })
        .catch(console.log('INIT MAP ERROR'));
}

function addListenerSearchLocation() {
    document.querySelector('.btn-go').onclick = () => {
        const userSearch = document.querySelector('.user-input').value; // get user input
        if (!userSearch) return;
        locService.getLocationByName(userSearch)
            .then(res => handleSearchGo(res))
            .catch((err) => console.log('cannot get the location...'))
    }
}

function handleSearchGo(res) {
    const location = res.results[0].geometry.location;
    changePosTo(location);
}

function addListenerMyLocation() {
    document.querySelector('.my-loc').onclick = () => {

        // ask  the user to allow position
        Swal.fire({
            title: '<strong>Hey!</strong>',
            icon: 'info',
            html: 'Are you allowing the app to get your location?',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Yes',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText: 'No',
            cancelButtonAriaLabel: 'Thumbs down'
        })
            .then(res => {
                if (res.isConfirmed) {
                    locService.getPosition()
                        .then(res => changePosTo({ lat: res.coords.latitude, lng: res.coords.longitude }))
                        .catch(error => console.log(error));
                }
            })
    }
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


function changePosTo(loc) {
    addMarker(loc);
    panTo(loc.lat, loc.lng);
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
                addMarker(currPos);
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
    }
}

function onRemoveLoc(locId) {
    mapService.deleteLoc(locId);
    renderLocations();
}
