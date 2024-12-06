import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore"; // Aggiungi questa riga

const firebaseConfig = {
  apiKey: "AIzaSyCwh2TS9lMYn1B7du9onkPA93nlwAr095I",
  authDomain: "craftapp-79839.firebaseapp.com",
  projectId: "craftapp-79839",
  storageBucket: "craftapp-79839.firebasestorage.app",
  messagingSenderId: "402831020813",
  appId: "1:402831020813:web:e0d6fd5eae7f5d71ef5644",
  measurementId: "G-5FG24SLF0Y"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Analytics
const analytics = getAnalytics(app);

// Inizializza Firestore
export const db = getFirestore(app); // Aggiungi questa riga

// Inizializza Authentication
export const auth = getAuth(app);