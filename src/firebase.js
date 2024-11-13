// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFEyO33SIyDw97iChEKM2Q3yKn1JJh_6E",
  authDomain: "non-profit-85896.firebaseapp.com",
  projectId: "non-profit-85896",
  storageBucket: "non-profit-85896.appspot.com",
  messagingSenderId: "978406924971",
  appId: "1:978406924971:web:fa9d12d8452b8b0194cdee",
  measurementId: "G-BN28EQF87C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { db };
export { auth, firestore, storage };

