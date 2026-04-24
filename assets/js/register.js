import { registerUser } from "./auth.js"

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const city = document.getElementById("city").value.trim()
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (!name || !email || !city || !password || !confirmPassword) {
      alert("Todos los campos son obligatorios")
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    try {
      await registerUser({
        name,
        email,
        password,
        favoriteCity: city
      });

      alert("Registro exitoso 🎉");
      window.location.href = "./login.html"

    } catch (error) {
      console.error(error)
      alert("Error: " + error.message)
    }
  })
})

