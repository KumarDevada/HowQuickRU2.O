// Import the functions you need from the SDKs you need
// import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBGOZ8_b0GXzFK7v9gtmLjNzcoVdDU0Jw",
  databaseURL: "https://wordsprint-4ffc8-default-rtdb.firebaseio.com/",
  authDomain: "wordsprint-4ffc8.firebaseapp.com",
  projectId: "wordsprint-4ffc8",
  storageBucket: "wordsprint-4ffc8.appspot.com",
  messagingSenderId: "642113931063",
  appId: "1:642113931063:web:c9335d91d741c649dffcb2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export const database = getDatabase(app);
export { ref } from "firebase/database";
