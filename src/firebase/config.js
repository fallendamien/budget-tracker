// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCeQeQ1UuS1Hiq6gjFroXBNN5iEY4ufN9o',
  authDomain: 'budget-tracker-20fed.firebaseapp.com',
  databaseURL: 'https://budget-tracker-20fed-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'budget-tracker-20fed',
  storageBucket: 'budget-tracker-20fed.firebasestorage.app',
  messagingSenderId: '88037701402',
  appId: '1:88037701402:web:8a6c2d59ade3ce35bc9ea3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
