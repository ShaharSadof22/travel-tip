console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


var map;
var currPos;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    addListenerMyLocation()
    addListenerSearchLocation()


    document.querySelector('.btn').addEventListener('click', (ev) => {
        mapService.panTo(35.6895, 139.6917);
    })

}

function addListenerSearchLocation() {
    document.querySelector('.btn-go').onclick = () => {
        const userSearch = document.querySelector('.user-input').value; // get user input
        if(!userSearch) return;
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

function changePosTo(loc) {
    addMarker(loc);
    panTo(loc.lat, loc.lng);
}

function addEventsListeners() {
    map.addListener('click', function (mapsMouseEvent) {
        var pos = {
            lat: mapsMouseEvent.latLng.lat(),
            lng: mapsMouseEvent.latLng.lng()
        };
        var isDoInit = onMapClick(pos);
        if (isDoInit) map.setCenter(pos.lat, pos.lng);

    });

    renderLocations();

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

    // function onRemoveLoc(locId) {
    //     deleteLoc(locId);
    //         addMarker({ lat: 32.0749831, lng: 34.9120554 });
    //         panTo({ lat: 32.0749831, lng: 34.9120554 });
    //     })

    // .catch(console.log('INIT MAP ERROR'));

    // locService.getPosition()
    //     .then(pos => {

    //         console.log('User position is:', pos.coords);
    //     })
    //     .catch(err => {
    //         console.log('Cannot get user-position', err);
    //     })
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
                onMapClick(currPos);
            })
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

locService.getLocs()
    .then(locs => console.log('locs', locs))



function onMapClick(pos) {
    map.addEventListener("click", function () {
        $('.modal').modal('show');
        // renderLocations();
    })
}


function onAddLocation() {
    var name = $('.input-modal').val();
    $('.input-modal').val('');
    if (name) {
        addLocation(gCurrentClick, name);
        renderLocations();
    }
}




    // function onMoveToMyLocation() {

    // }

    // document.querySelector('.btn').addEventListener('click', (ev) => {
    //     console.log('Aha!', ev.target);
    //     mapService.panTo(35.6895, 139.6917);
    // })

// function renderLocations() {
//     var locations = getLocations();
//     var htmlLocStr = locations.map(loc => {
//         return `<tr> <td class="loc-name" onclick="initMap(${loc.pos.lat}, ${loc.pos.lng})">${loc.name}</td>
//          <td class="loc-pos">${loc.pos.lat},\ ${loc.pos.lng} </td> 
//          <td><button class="delete-loc" onclick="onRemoveLoc('${loc.id}')">X</button></td></tr>`;
//     });
//     $('.loc-table tbody').html(htmlLocStr.join(''));
// }
