// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCgWnrfbdSILKINeETiz_i1yRn4IgZ5kWc",
    authDomain: "zeno-91111.firebaseapp.com",
    projectId: "zeno-91111",
    storageBucket: "zeno-91111.appspot.com",
    messagingSenderId: "470032805225",
    appId: "1:470032805225:web:257e8009f1c8f7d07b61f8",
    measurementId: "G-V6F81KM8TX"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
