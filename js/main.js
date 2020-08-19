console.log('Main!');

// import { init } from './controller/main-controller.js'
import { locService } from './services/loc-service.js'
import { mapService } from './services/map.service.js'


// locService.getLocs()
//     .then(locs => console.log('locs', locs))
var map;
var currPos;

window.onload = () => {
    initMap()
        .then(() => {
            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    document.querySelector('.my-loc').onclick = () => {
        locService.getPosition()
            .then((pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                console.log("addMarker on MAP success -> loc", loc)
                mapService.addMarker(loc)
            })
            .catch(error => console.log(error));
    }

    document.querySelector('.btn').addEventListener('click', (ev) => {
        mapService.panTo(35.6895, 139.6917);
    })

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
