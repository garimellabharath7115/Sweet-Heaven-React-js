import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDds64IhTqeDkcycnf73fTluPQUt43X4dc",
  authDomain: "hrms-workflow.firebaseapp.com",
  projectId: "hrms-workflow",
  storageBucket: "hrms-workflow.firebasestorage.app",
  messagingSenderId: "48513817854",
  appId: "1:48513817854:web:54a5c44032904617da19af",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);