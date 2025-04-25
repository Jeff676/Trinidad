// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDNPG-_TESjTcfHEJE524a6c-wBSmsDCvg',
  authDomain: 'trinidad-e0aae.firebaseapp.com',
  projectId: 'trinidad-e0aae',
  storageBucket: 'trinidad-e0aae.firebasestorage.app',
  messagingSenderId: '248656044510',
  appId: '1:248656044510:web:850a716155859b8300bd4f',
  measurementId: 'G-G26S9775N7',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const auth = getAuth(app)

export const firebaseApp = initializeApp(firebaseConfig)
export { auth }
