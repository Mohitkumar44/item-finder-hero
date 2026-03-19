import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe0tmchgjAJjSMFcgdwKBQq1K4gWa5gsg",
  authDomain: "findit-d44c5.firebaseapp.com",
  projectId: "findit-d44c5",
  storageBucket: "findit-d44c5.firebasestorage.app",
  messagingSenderId: "108096346188",
  appId: "1:108096346188:web:13b62fab128a0104bf3ce9",
  measurementId: "G-B45RVT28L8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
