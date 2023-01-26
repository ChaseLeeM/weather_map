//Mapbox Call
mapboxgl.accessToken = keys.mapbox;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: [-98.490415, 29.4267], // starting position [lng, lat]
    zoom: 2, // starting zoom
});

//Function for adding Weather to Cards
function weatherCall(location){
    let html = ""
        for (let i = 0; i < location.list.length; i+=8) {
            let weather = location.list[i];
            let date = new Date(weather.dt * 1000);
            let day = date.getDay();
            let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let dayName = days[day];
            let temp = weather.main.temp;
            let highLow = weather.main.temp_max + "/" + weather.main.temp_min;
            let icon = weather.weather[0].icon;
            let humidity = weather.main.humidity;
            let description = weather.weather[0].description;
            html += `<div class="card col-2">
                      <div class="card-body">
                        <h5 class="card-title">${dayName}</h5>
                            <p class="card-text">${temp}°F</p>
                            <p class="card-text">${highLow}°F</p>
                            <p class="card-text">${humidity}%</p>
                            <p class="card-text">${description}</p>
                            <img src="http://openweathermap.org/img/w/${icon}.png" alt="${description}">
                        </div>
                    </div>`;
        }
        $("#weather").html(html);
};

//Sets location by Search bar submit
document.getElementById("searchBtn").addEventListener('click', function (e) {
    e.preventDefault();
    let location = $("#searchBar").val();
    geocode(location, keys.mapbox).then(function (loc) {
        $(".mapboxgl-marker").remove();
        let newMarker = new mapboxgl.Marker({draggable: true}).setLngLat(loc).addTo(map);
        map.panTo(loc)
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            APPID: keys.weatherKey,
            q:     location,
            units: "imperial"
        }).done(function (location) {
            weatherCall(location);
            $('#weather').removeClass("hide");
        });
    });
});


// Sets New Location By Map Click
    map.on('click', (e) => {
        $(".mapboxgl-marker").remove();
        let coordinates = e.lngLat;
        let newMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map)
        console.log(coordinates.lng, coordinates.lat);
        map.setCenter(coordinates)
        map.setZoom(10)
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            appid: keys.weatherKey,
            units: "imperial",
            lon: coordinates.lng,
            lat: coordinates.lat,
        }).done(function (location ) {
            weatherCall(location);
            $('#weather').removeClass("hide");
        });
    });

