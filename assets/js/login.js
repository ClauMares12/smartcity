document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()


    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value

    if (!email || !password) {
        showAlert('loginAlert', 'Por favor, complete todos los campos')
        return
    }

    localStorage.setItem('userEmail', email.split('@')[0])
    window.location.href = 'dashboard.html'

})