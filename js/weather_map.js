$(document).ready(function() {


mapboxgl.accessToken = keys.mapbox;
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 10,
    center: [-98.4916, 29.4252]
});



$.get("http://api.openweathermap.org/data/2.5/forecast", {
    APPID: keys.weatherKey,
    q:     "San Antonio, US",
    units: "imperial"
}).done(function(data) {
    for (let i = 0; i < data.list.length; i+=8) {
        let weather = data.list[i];
        let date = new Date(weather.dt * 1000);
        let day = date.getDay();
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let dayName = days[day];
        let temp = weather.main.temp;
        let highLow = weather.main.temp_max + "/" + weather.main.temp_min;
        let icon = weather.weather[0].icon;
        let humidity = weather.main.humidity;
        let description = weather.weather[0].description;
        let html = `<div class="card col-2">
                      <div class="card-body">
                        <h5 class="card-title">${dayName}</h5>
                            <p class="card-text">${temp}°F</p>
                            <p class="card-text">${highLow}°F</p>
                            <p class="card-text">${humidity}%</p>
                            <p class="card-text">${description}</p>
                            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
                        </div>
                        </div>`;
        $(".weather").append(html);
    }
});

function geocode(search, token) {
    var baseUrl = 'https://api.mapbox.com';
    var endPoint = '/geocoding/v12/mapbox.places/';
    return fetch(baseUrl + endPoint + encodeURIComponent(search) + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
            // to get all the data from the request, comment out the following three lines...
        }).then(function(data) {
            return data.features[0].center;
        });
}
    function reverseGeocode(coordinates, token) {
        var baseUrl = 'https://api.mapbox.com';
        var endPoint = '/geocoding/v5/mapbox.places/';
        return fetch(baseUrl + endPoint + coordinates.lng + "," + coordinates.lat + '.json' + "?" + 'access_token=' + token)
            .then(function(res) {
                return res.json();
            })
            // to get all the data from the request, comment out the following three lines...
            .then(function(data) {
                return data.features[0].place_name;
            });
function setMarker(lng, lat) {
    var marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
}


$("#searchBtn").click(function(e) {
    e.preventDefault();
    let search = $("#searchBar").val();
    geocode(search, keys.mapbox).then(function(result) {
        setMarker(result[0], result[1]);
        map.flyTo({
            center: result,
            essential: true
        });
    });
});


map.on('click', function(e) {
    reverseGeocode(e.lngLat, keys.mapbox).then(function(result) {
        alert(result);
    });



});
