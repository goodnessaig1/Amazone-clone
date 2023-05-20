import firebase from "firebase"
// import 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEI5-aaYS0Xulc-IC1k-CvusI08Nupw_U",
  authDomain: "clone-7f4a5.firebaseapp.com",
  projectId: "clone-7f4a5",
  storageBucket: "clone-7f4a5.appspot.com",
  messagingSenderId: "652262312276",
  appId: "1:652262312276:web:05ef96d8eb921db1b920c1",
  measurementId: "G-LSH78B43PC"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };