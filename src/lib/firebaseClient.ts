// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUjqbK3i6d78mG2waoAeBmb8Ns8r_0Cws",
  authDomain: "studio-4746052214-a7a40.firebaseapp.com",
  projectId: "studio-4746052214-a7a40",
  storageBucket: "studio-4746052214-a7a40.firebasestorage.app",
  messagingSenderId: "126928125027",
  appId: "1:126928125027:web:8275f2c7a07fdabe840c56"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
