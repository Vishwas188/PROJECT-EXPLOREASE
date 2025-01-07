mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: coordinates,// starting position [lng, lat]
    zoom: 9// starting zoom
});



 //Create a default Marker and add it to the map.
 const marker1 = new mapboxgl.Marker({color:"red"})
 .setLngLat(coordinates)
 .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML("<h6>Exact location will provided after booking..</h6>")
 )
 .addTo(map);