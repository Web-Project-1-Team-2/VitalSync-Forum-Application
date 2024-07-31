
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD8jXpgSaPHRpfBm1dMeNyZpSlOuzcVbS4",
    authDomain: "web-project-2-team-2.firebaseapp.com",
    projectId: "web-project-2-team-2",
    storageBucket: "web-project-2-team-2.appspot.com",
    messagingSenderId: "367990329419",
    appId: "1:367990329419:web:f798c1f150c08c8a283dce",
    databaseURL: "https://web-project-2-team-2-default-rtdb.europe-west1.firebasedatabase.app/"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);