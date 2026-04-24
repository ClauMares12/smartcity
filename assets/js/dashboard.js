import { observeAuth, logoutUser, getCurrentUserProfile } from "./auth.js"
import { formatWeatherUpdateTime, getCityWeather } from "./weather.js"

const userNameElement = document.getElementById('userName')
const userEmailElement = document.getElementById('userEmail')
const userFavoriteCityElement = document.getElementById('favoriteCity')
const logoutBtn = document.getElementById('logoutBtn')


const weatherAlert = document.getElementById('weatherAlert')
const weatherContent = document.getElementById('weatherContent')


const weatherCityName = document.getElementById('weatherCityName')
const weatherDescription = document.getElementById('weatherDescription')
const weatherTemperature = document.getElementById('weatherTemperature')
const weatherApparentTemp = document.getElementById('weatherApparentTemp')
const weatherHumidity = document.getElementById('weatherHumidity')
const weatherWind = document.getElementById('weatherWind')
const weatherCoords = document.getElementById('weatherCoords')
const weatherUpdatedAt = document.getElementById('weatherUpdatedAt')
const weatherIcon = document.getElementById('weatherIcon')
const refreshWeatherBtn = document.getElementById('refreshWeatherBtn')

let currentFavoriteCity = ""

// ALERTAS
const showWeatherAlert = (message) => {
    if (weatherAlert) {
        weatherAlert.textContent = message
        weatherAlert.classList.remove('d-none')
    }
}

const hideWeatherAlert = () => {
    if (weatherAlert) {
        weatherAlert.textContent = ''
        weatherAlert.classList.add('d-none')
    }
}

const hideWeatherContent = () => {
    if (weatherContent) {
        weatherContent.classList.add('d-none')
    }
}


const buildLocationName = (location) => {
    return `${location.name}, ${location.admin1}`
}


const renderWeatherContent = (weatherData) => {
    const { location, current, weatherInfo } = weatherData

    weatherCityName.textContent = buildLocationName(location)
    weatherDescription.textContent = weatherInfo.label
    weatherTemperature.textContent = `${Math.round(current.temperature_2m)}°C`
    weatherApparentTemp.textContent = `${Math.round(current.apparent_temperature)}°C`
    weatherHumidity.textContent = `${current.relative_humidity_2m}%`
    weatherWind.textContent = `${current.wind_speed_10m} km/h`
    weatherCoords.textContent = `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
    weatherUpdatedAt.textContent = formatWeatherUpdateTime(current.time)

    weatherIcon.className = `bi ${weatherInfo.icon}`

    weatherContent.classList.remove('d-none')
}

// CARGAR CLIMA
const loadWeatherForCity = async (cityName) => {
    if (!cityName || cityName === '' || cityName === 'No definida') {
        showWeatherAlert('No tienes una ciudad favorita definida.')
        hideWeatherContent()
        return
    }

    hideWeatherAlert()
    hideWeatherContent()

    try {
        const weatherData = await getCityWeather(cityName)
        console.log("CLIMA:", weatherData)

        // 🔥 ESTA LÍNEA FALTABA
        renderWeatherContent(weatherData)

    } catch (error) {
        console.error("ERROR CLIMA:", error)
        showWeatherAlert("No fue posible cargar el clima.")
    }
}

// LOGIN
observeAuth(async user => { 
    if (!user) {
        window.location.href = './login.html'
        return
    }

    try {
        const profile = await getCurrentUserProfile(user.uid, user)

        const resolvedName = profile?.name || user.email?.split('@')[0] || 'Usuario'
        const resolvedEmail = profile?.email || user.email || '--'
        const resolvedFavoriteCity = profile?.favoriteCity?.trim() || 'No definida'

        if (userNameElement) userNameElement.textContent = resolvedName
        if (userEmailElement) userEmailElement.textContent = resolvedEmail
        if (userFavoriteCityElement) userFavoriteCityElement.textContent = resolvedFavoriteCity

        currentFavoriteCity = resolvedFavoriteCity

        await loadWeatherForCity(currentFavoriteCity)

    } catch (error) {
        console.error("ERROR PERFIL:", error)
        showWeatherAlert("No fue posible cargar tu perfil")
    }
})


if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await logoutUser()
        window.location.href = './login.html'
    })
}


if (refreshWeatherBtn) {
    refreshWeatherBtn.addEventListener('click', async () => {
        await loadWeatherForCity(currentFavoriteCity)
    })
}
