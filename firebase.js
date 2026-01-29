import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtkboqBU4glzribVRUppSogeYTfKPNRxg",
  authDomain: "calculadora-get-24f0e.firebaseapp.com",
  projectId: "calculadora-get-24f0e",
  storageBucket: "calculadora-get-24f0e.appspot.com",
  messagingSenderId: "290359667139",
  appId: "1:290359667139:web:361dbd5e02d65b22e63576"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
