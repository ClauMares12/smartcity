import { showAlert, setButtonLoading, registerUser,
     getFirebaseErrorMessage} from "./auth.js"

const form = document.getElementById('registerForm')
const nameInput = document.getElementById('registerName')
const emailInput = document.getElementById('registerEmail')
const favoriteCityInput = document.getElementById('registerFavoriteCity')
const passwordInput = document.getElementById('registerPassword')
const confirmPasswordInput = document.getElementById('registerPasswordConfirm')
const registerBtn = form.querySelector('button[type="submit"]') 
const successAlert = document.getElementById('registerSuccessAlert')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    hideAlert('registerAlert')
    successAlert.classList.add('d-none')
    successAlert.textContent = ''
    

    const name = nameInput.value.trim()
    const email = emailInput.value.trim()
    const favoriteCity = favoriteCityInput.value.trim()
    const password = passwordInput.value.trim()
    const confirmpassword = confirmPasswordInput.value.trim()
    

    if (!name || !email || !password || !confirmpassword) {
        showAlert('registerAlert', 'Por favor, complete todos los campos')
        return
    }

    // Agregar validación para que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
        showAlert('registerAlert', 'La contraseña debe tener al menos 6 caracteres')
        return
    }

    if (password !== confirmpassword) {
        showAlert('registerAlert', 'Las contraseñas no coinciden')
        return
    }

    try {
    setButtonLoading(registerBtn, true, '<i class="bi bi-box-arrow-in-right me-2"></i> Crear cuenta',
        'Creando cuenta...')
    await registerUser({name, email, password, favoriteCity})
    
    successAlert.classList.remove('d-none')
    successAlert.textContent = 'Cuenta creada correctamente.'

    setTimeout(() => {
    window.location.href = './../../dashboard.html'
    },1200)

    } catch (error) {
    showAlert('registerAlert', getFirebaseErrorMessage(error))
    
    } finally {
    setButtonLoading(registerBtn, false, '<i class="bi bi-box-arrow-in-right me-2"></i> Crear cuenta')
    }

    
})
