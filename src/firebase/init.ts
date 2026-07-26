// Firebase initialisation (Lab 8).
// Config moved here from main.ts so Firebase/Firestore can be imported as a module.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD_Qhu1tmwFqOCYfjm4eei6ya4uGF0C_ec',
  authDomain: 'fit5032-f3735.firebaseapp.com',
  projectId: 'fit5032-f3735',
  storageBucket: 'fit5032-f3735.firebasestorage.app',
  messagingSenderId: '915200458647',
  appId: '1:915200458647:web:280bd716c248a5a73d0ed2',
  measurementId: 'G-TBCTBMTLE7',
}

// Initialise the Firebase app
const firebaseApp = initializeApp(firebaseConfig)

// Firestore database instance
const db = getFirestore(firebaseApp)

export default firebaseApp
export { db }
