import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDK-REW8o8pWTZvMT3JZRjHcg3VI6vxCYM",
  authDomain: "toys-shop-4cab5.firebaseapp.com",
  projectId: "toys-shop-4cab5",
  storageBucket: "toys-shop-4cab5.appspot.com",
  messagingSenderId: "63931881435",
  appId: "1:63931881435:web:883a58c043e8dd1e9ab9fe"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const dbreal = getDatabase(app);
export const storage = getStorage(app)