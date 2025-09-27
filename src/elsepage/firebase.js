// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbnqwBY2KyQGPMd6fXX5jz7g3qoK8edm8",
  authDomain: "https://balancedmindsconsultancy.netlify.app/",
  projectId: "balanced-minds-consultancy",
  storageBucket: "balanced-minds-consultancy.firebasestorage.app",
  messagingSenderId: "600070201853",
  appId: "1:600070201853:web:6d723b46e3d6854df47994",
  measurementId: "G-Y9WP0WT4HL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink };
