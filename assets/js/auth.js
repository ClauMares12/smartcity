import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js"

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js"

import { auth, db } from "./firebase-config.js"

// ALERTAS
export function showAlert(elementId, message) {
  const el = document.getElementById(elementId)
  if (!el) return;
  el.textContent = message
  el.classList.remove("d-none")
}

export function hideAlert(elementId) {
  const el = document.getElementById(elementId)
  if (!el) return;
  el.classList.add("d-none")
  el.textContent = ""
}

// BOTÓN LOADING
export function setButtonLoading(button, isLoading, text, loadingText = "Procesando...") {
  if (!button) return;
  button.disabled = isLoading
  button.innerHTML = isLoading
    ? `<span class="spinner-border spinner-border-sm me-2"></span>${loadingText}`
    : text
}

// REGISTRO
export async function registerUser({ name, email, password, favoriteCity }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const user = credential.user

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name || user.email.split("@")[0],
    email: user.email,
    favoriteCity: favoriteCity || "Leon",
    createdAt: serverTimestamp()
  });

  return user
}

// LOGIN
export async function loginUser({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

// PERFIL (AUTO-CREA SI NO EXISTE)
export async function getCurrentUserProfile(uid, user) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  } else {
    const newProfile = {
      uid: uid,
      name: user.email?.split("@")[0] || "Usuario",
      email: user.email || "",
      favoriteCity: "Leon",
      createdAt: serverTimestamp()
    };

    await setDoc(ref, newProfile);
    return newProfile;
  }
}

// OBSERVADOR
export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

// LOGOUT
export async function logoutUser() {
  await signOut(auth)
}

// ERRORES
export function getFirebaseErrorMessage(error) {
  const code = error?.code || ""

  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado."
    case "auth/invalid-email":
      return "Correo inválido."
    case "auth/weak-password":
      return "Mínimo 6 caracteres."
    case "auth/invalid-credential":
      return "Credenciales incorrectas."
    default:
      return "Error inesperado."
  }
}