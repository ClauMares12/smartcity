  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyANQiu07qg6u3gbKtK4nT7caoR_dvytq-8",
    authDomain: "smart-city-1ec96.firebaseapp.com",
    projectId: "smart-city-1ec96",
    storageBucket: "smart-city-1ec96.firebasestorage.app",
    messagingSenderId: "216202288554",
    appId: "1:216202288554:web:23b45c52c893b55a6b5fd3"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export { app, auth, db }
  