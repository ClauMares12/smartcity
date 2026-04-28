import {
    observeAuth,
    logoutUser,
    getCurrentUserProfile,
    hideAlert,
    setButtonLoading,
    showAlert,
    updateCurrentUserProfile
} from "./auth.js"

import {
    formatWeatherUpdateTime,
    getCityWeather
} from "./weather.js"

// ELEMENTOS DOM
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

// PERFIL
const editProfileForm = document.getElementById('editProfileForm')
const editName = document.getElementById('editName')
const editEmail = document.getElementById('editEmail')
const editCity = document.getElementById('editCity')
const editProfileBtn = document.getElementById('editProfileBtn')

const editProfileModalElement = document.getElementById('editProfileModal')
const editProfileModal = editProfileModalElement
    ? bootstrap.Modal.getOrCreateInstance(editProfileModalElement)
    : null

// VARIABLES GLOBALES
let currentUser = null
let currentProfile = null
let currentFavoriteCity = ""

// ================= ALERTAS =================
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

const renderProfile = (user, profile) => {
    const resolvedName = profile?.name || user.email?.split('@')[0] || 'Usuario'
    const resolvedEmail = profile?.email || user.email || '-'
    const resolvedCity = profile?.favoriteCity?.trim() || ''

    if (userNameElement) userNameElement.textContent = resolvedName
    if (userEmailElement) userEmailElement.textContent = resolvedEmail
    if (userFavoriteCityElement) userFavoriteCityElement.textContent = resolvedCity || 'No definida'

    if (editName) editName.value = resolvedName
    if (editEmail) editEmail.value = resolvedEmail
    if (editCity) editCity.value = resolvedCity

    currentFavoriteCity = resolvedCity
}

// ================= CLIMA =================
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
        renderWeatherContent(weatherData)
    } catch (error) {
        console.error("ERROR CLIMA:", error)
        showWeatherAlert("No fue posible cargar el clima.")
    }
}

// ================= RECARGA =================
const reloadProfileAndWeather = async () => {
    if (!currentUser) return

    const profile = await getCurrentUserProfile(currentUser.uid)
    currentProfile = profile

    renderProfile(currentUser, profile)
    await loadWeatherForCity(currentFavoriteCity)
}

// ================= AUTH =================
observeAuth(async (user) => {
    if (!user) {
        window.location.href = './login.html'
        return
    }

    currentUser = user

    try {
        const profile = await getCurrentUserProfile(user.uid)
        currentProfile = profile

        renderProfile(user, profile)
        await loadWeatherForCity(currentFavoriteCity)

    } catch (error) {
        console.error("ERROR PERFIL:", error)
        showWeatherAlert("No fue posible cargar tu perfil")
    }
})

// ================= LOGOUT =================
logoutBtn?.addEventListener('click', async () => {
    await logoutUser()
    window.location.href = './login.html'
})

// ================= REFRESH =================
refreshWeatherBtn?.addEventListener('click', async () => {
    await loadWeatherForCity(currentFavoriteCity)
})

// ================= EDITAR PERFIL =================
editProfileForm?.addEventListener('submit', async (event) => {
    event.preventDefault()

    hideAlert('profileAlert')
    hideAlert('profileSuccess')

    const name = editName.value.trim()
    const city = editCity.value.trim()

    if (!name) {
        showAlert('profileAlert', 'El nombre es obligatorio')
        return
    }

    if (!city) {
        showAlert('profileAlert', 'La ciudad es obligatoria')
        return
    }

    try {
        setButtonLoading(
            editProfileBtn,
            true,
            '<i class="bi bi-check-circle m-2"></i> Guardar Cambios',
            'Guardando...'
        )

        await updateCurrentUserProfile(currentUser.uid, {
            name,
            favoriteCity: city
        })

        showAlert('profileSuccess', 'Perfil actualizado correctamente')

        await reloadProfileAndWeather()

        setTimeout(() => {
            editProfileModal?.hide()
            hideAlert('profileSuccess')
        }, 1500)

    } catch (error) {
        showAlert('profileAlert', error.message || 'No se pudo actualizar')
    } finally {
        setButtonLoading(
            editProfileBtn,
            false,
            '<i class="bi bi-check-circle m-2"></i> Guardar Cambios'
        )
    }
})