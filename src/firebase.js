
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaDxmerXaMUd4txCCwKH37_o50bdIQl4g",
    authDomain: "bigecommerce-7f57e.firebaseapp.com",
    projectId: "bigecommerce-7f57e",
    storageBucket: "bigecommerce-7f57e.appspot.com",
    messagingSenderId: "339122900043",
    appId: "1:339122900043:web:aa52f5c8ab41605df5d1ce"
  };
  
  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

  //export
  export const auth = firebase.auth()
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();