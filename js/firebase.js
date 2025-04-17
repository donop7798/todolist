import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxRrX7mCDURme97jVZCQZKZKOxhPK0u4c",
    authDomain: "todolist-7e983.firebaseapp.com",
    projectId: "todolist-7e983",
    storageBucket: "todolist-7e983.appspot.com",
    messagingSenderId: "708377851604",
    appId: "1:708377851604:web:6855f3e4f69b3b49916d41",
    measurementId: "G-LHJY8EZ8F3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, updateDoc, arrayUnion, setDoc };