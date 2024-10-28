import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBrtL5mBNMDHTqm-taNke_4cL6WY0RfIyc",
    authDomain: "simple-chat-cg.firebaseapp.com",
    projectId: "simple-chat-cg",
    storageBucket: "simple-chat-cg.appspot.com",
    messagingSenderId: "913841201382",
    appId: "1:913841201382:web:710dff3768348ea59edb27",
  };
  
  // Initialize Firebase
  export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  export const auth = getAuth(firebaseApp);
  export const storage = getStorage(firebaseApp);