import { hideAlert, showAlert, setButtonLoading, loginUser, observeAuth, getFirebaseErrorMessage } from "./auth.js"

const form = document.getElementById('loginForm')
const emailInput = document.getElementById('loginEmail')
const passwordInput = document.getElementById('loginPassword')
const loginBtn = form.querySelector('button[type="submit"]')


observeAuth(user => {
    if (user) {
        window.location.href = './dashboard.html'
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    hideAlert('loginAlert')

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!email || !password) {
        showAlert('loginAlert', 'Por favor, complete todos los campos')
        return
    }

    try {
        setButtonLoading(loginBtn, true, 'Iniciar sesión', 'Iniciando sesión...')

        await loginUser({ email, password })

        window.location.href = './dashboard.html'

    } catch (error) {
        showAlert('loginAlert', getFirebaseErrorMessage(error))
    } finally {
        setButtonLoading(loginBtn, false, 'Iniciar sesión')
    }
})

