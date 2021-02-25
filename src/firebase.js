import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBNg0zwlT9v1VM8KE9LbRlJjoP7avNETHE",
    authDomain: "tvl-snacks.firebaseapp.com",
    projectId: "tvl-snacks",
    storageBucket: "tvl-snacks.appspot.com",
    messagingSenderId: "2079059380",
    appId: "1:2079059380:web:4b7013ea08abcdecc5d6e1",
    measurementId: "G-39TXP2LVES"
};


firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
