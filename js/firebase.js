import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "kode",
    authDomain: "kode",
    projectId: "kode",
    storageBucket: "kode",
    messagingSenderId: "kode",
    appId: "kode",
    measurementId: "scrollfesnuk"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, updateDoc, arrayUnion, setDoc };
