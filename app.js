window.addEventListener('load', () => {
    const apiKey = '59f1c765408d4b9c86d122914210811'
    let long;
    let lat;
    let tempDegree = document.querySelector('.temp-degree')
    let tempDesc = document.querySelector('.temp-description')
    let loc = document.querySelector('.location-timezone')
    let tempIcon = document.querySelector('.icon img')
    let searchBox = document.querySelector('#location-search input')
    let searchResults = document.querySelector('.search-results')
    let searchMenu = document.querySelector('.search-location')


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude
            lat = position.coords.latitude
            getApiResource(long, lat)

        })
    }

    function getApiResource(long, lat) {
        const api = `http://api.weatherapi.com/v1/current.json?q=${lat},${long}&key=${apiKey}`
        fetch(api).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
            const temperature = data.current.temp_c
            const { text, icon } = data.current.condition
            const { name, region, country } = data.location
            setDomElememts(temperature, text, icon, name, region, country)
        })
    }

    // Change DOM Element with API data
    function setDomElememts(temperature, text, icon, name, region, country) {
        tempDegree.textContent = temperature
        tempDesc.textContent = text
        tempIcon.setAttribute('src', icon)
        loc.textContent = `${name}, ${region} Region / ${country}`
    }

    function searchLocations() {
        searchBox.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase()
            const searchApi = `http://api.weatherapi.com/v1/search.json?q=${searchTerm}&key=${apiKey}`
            searchResults.textContent = ""

            // filter searched location from the api response data 
            if (searchTerm.length >= 1) {
                searchMenu.style.display = 'block'
                fetch(searchApi).then((response) => {
                    return response.json()
                }).then((data) => {
                    const locations = data
                    Array.from(locations).forEach(location => {
                        if (location.name.toLowerCase().indexOf(searchTerm) !== -1) {
                            const li = document.createElement('li')
                            const long = document.createElement('span')
                            const lat = document.createElement('span')
                            li.textContent = location.name
                            long.textContent = location.lon
                            lat.textContent = location.lat
                            searchResults.appendChild(li)
                            li.appendChild(long)
                            li.appendChild(lat)
                        }
                    });
                })
            } else {
                searchMenu.style.display = 'none'
            }
        })
    }

    function searchWeather() {
        searchResults.addEventListener('click', (e) => {
            if (e.target.tagName == "LI") {
                searchBox.value = e.target.textContent
                cord = e.target.querySelectorAll('span')
                long = cord[0].textContent
                lat = cord[1].textContent
                console.log(long);
                console.log(lat);
                getApiResource(long, lat)
            }
        })
    }
    searchWeather()
    searchLocations()
})