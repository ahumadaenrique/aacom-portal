import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPQKjDXn3VaPgrfUQRTiy6zSUSR1qOt3U",
  authDomain: "aacom-reclutamiento.firebaseapp.com",
  projectId: "aacom-reclutamiento",
  storageBucket: "aacom-reclutamiento.firebasestorage.app",
  messagingSenderId: "410385259074",
  appId: "1:410385259074:web:073901b6dc7c0031692bdb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, getDoc, collection, getDocs, updateDoc, ref, uploadBytes, getDownloadURL };
