import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAElWkVgH0Kc6MuVyNqLeJLbMKwua_eG8o",
  authDomain: "delhi-greenconnect-app.firebaseapp.com",
  projectId: "delhi-greenconnect-app",
  storageBucket: "delhi-greenconnect-app.firebasestorage.app",
  messagingSenderId: "1045306356006",
  appId: "1:1045306356006:web:3e2bdd9721bc4bd46f51e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
