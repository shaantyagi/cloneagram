import firebase from 'firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore
import 'firebase/messaging';   // for cloud messaging
import 'firebase/functions';   // for cloud functions

const firebaseConfig = firebase.initializeApp({ 
    apiKey: "AIzaSyDuzSz8tEwNPv6TiontQqTrB1pdTqEncBk",
    authDomain: "cloneagram-f1abf.firebaseapp.com",
    databaseURL: "https://cloneagram-f1abf.firebaseio.com",
    projectId: "cloneagram-f1abf",
    storageBucket: "cloneagram-f1abf.appspot.com",
    messagingSenderId: "909359835921",
    appId: "1:909359835921:web:e93c218e59483674fb3ab0",
    measurementId: "G-EB7YXC9DBT"
 });

  const db=firebaseConfig.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export {db,auth,storage};