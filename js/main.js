console.log('Main!');

// import { init } from './controller/main-controller.js'
import { locService } from './services/loc-service.js'
import { mapService } from './services/map.service.js'


// locService.getLocs()
//     .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
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

        // locService.getPosition()
        //     .then(pos => {
        //         console.log('User position is:', pos.coords);
        //     })
        //     .then(addEventsListeners)
        //     .catch(err => {
        //         console.log('Cannot get user-position', err);
        //     })
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
        mapService.panTo(35.6895, 139.6917);
    })

    function onMoveToMyLocation() {

    }