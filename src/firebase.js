import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyB5jGnRYQwnndbkE90LAOzksbWmUqrMP-0",
  authDomain: "itercage-d4495.firebaseapp.com",
  databaseURL: "https://itercage-d4495.firebaseio.com",
  projectId: "itercage-d4495",
  storageBucket: "itercage-d4495.appspot.com",
  messagingSenderId: "336717893649",
  appId: "1:336717893649:web:914cdeb9323bba7723e1b0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const database = firebase.firestore();
