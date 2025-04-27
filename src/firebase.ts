import { initializeApp } from 'firebase/app'

// TODO: Replace with your actual Firebase project configuration
// Consider loading these from environment variables
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
