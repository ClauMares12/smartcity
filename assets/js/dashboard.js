document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName') || 'Usuario'
    document.getElementById('userName').textContent = userName

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('userName')
        window.location.href = 'login.html'
    })
})