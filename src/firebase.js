import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtGcFZYB2B6IO2BAdCyvuZ0NyxQ8elbaE",
  authDomain: "form-c157d.firebaseapp.com",
  projectId: "form-c157d",
  storageBucket: "form-c157d.appspot.com", // Fixed incorrect storage bucket domain
  messagingSenderId: "198375462076",
  appId: "1:198375462076:web:39797b9bd965daff25ecb9",
  measurementId: "G-3066CLWZMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = () => signInWithPopup(auth, provider);

// Function to register a user with email and password
const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Function to sign in with email and password
const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export { auth, provider, signInWithGoogle, signUpWithEmail, signInWithEmail };
