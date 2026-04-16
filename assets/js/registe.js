document.getElementById('registerForm').addEventListener('submit', async (e) => {
   e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmpassword = document.getElementById('confirmpassword').value

    if (!name || !email || !password || !confirmpassword) {
        showAlert('registerAlert', 'Por favor, complete todos los campos')
        return
    }

    if (password !== confirmpassword) {
        showAlert('registerAlert', 'Las contraseñas no coinciden')
        return
    }

    // Simulacion de registro
    localStorage.setItem('userEmail', name)

    showAlert('registerAlert', 'Registro exitoso!')
    window.location.href = 'login.html'
})

