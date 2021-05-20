import * as firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyCjnwssmjf0V7fQJf0PAlor7I_1oq3t86Y",
  authDomain: "swish-s.firebaseapp.com",
  projectId: "swish-s",
  storageBucket: "swish-s.appspot.com",
  messagingSenderId: "530086356514",
  appId: "1:530086356514:web:5a22dcb1c3af1413eccc7b",
  measurementId: "G-K6B2TB98K6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// refOn = callback => {
//   this.ref
//     .limitToLast(20)
//     .on('child_added', snapshot => callback(this.parse(snapshot)));
// }

// parse = snapshot => {
//   const { timestamp: numberStamp, text, user } = snapshot.val();
//   const { key: _id } = snapshot;
//   const timestamp = new Date(numberStamp);
//   const message = { _id, timestamp, text, user };
//   return message;
// };

// send = messages => {
//   for (let i = 0; i < messages.length; i++) {
//     const { text, user } = messages[i];
//     const message = { text, user, createdAt: this.timestamp, };
//     this.ref.push(message);
//   }
// }

export { firebase }