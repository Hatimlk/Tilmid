import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAa1wggS3_wI3b9gWA1awo0xNE6orfPslI",
    authDomain: "tilmid-75819.firebaseapp.com",
    projectId: "tilmid-75819",
    storageBucket: "tilmid-75819.firebasestorage.app",
    messagingSenderId: "560489645339",
    appId: "1:560489645339:web:99f3ec8c5b18fec1263fbe",
    measurementId: "G-9R8V22J0BX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
