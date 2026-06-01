import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAG9V04LgozE5QTvnKtFIrpVZf6lI_7Pa0",
    authDomain: "umbrella-corporation-c51f4.firebaseapp.com",
    projectId: "umbrella-corporation-c51f4",
    storageBucket: "umbrella-corporation-c51f4.firebasestorage.app",
    messagingSenderId: "745734921529",
    appId: "1:745734921529:web:7fd64cfb34fd437397dce8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);