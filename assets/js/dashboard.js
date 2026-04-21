import { observeAuth, logoutUser, getCurrentUserProfile } from "./auth"

const userNameElement = document.getElementById('userName')
const userEmailElement = document.getElementById('userEmail')
const userFavoriteCityElement = document.getElementById('userFavoriteCity')
const logoutBtn = document.getElementById('logoutBtn')

observeAuth(async user => { 
    if (!user) {
        window.location.href = './../../login.html'
        return
    }
    const profile = await getCurrentUserProfile(user.uid)

    const resolvedName = profile?.Name || 'Usuario'
    const resolvedEmail = profile?.email || '--'
    const resolvedFavoriteCity = profile?.favoriteCity || 'No Added'

    userNameElement.textContent = resolvedName
    navUserNameElement.textContent = resolvedName
    userEmailElement.textContent = resolvedEmail
    userFavoriteCityElement.textContent = resolvedFavoriteCity
})

logoutBtn.addEventListener('click', async () => {
    await logoutUser()
    window.location.href = './../../login.html'
})