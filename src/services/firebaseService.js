import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Resume submissions collection
export const addResumeSubmission = async (studentData, resumeText) => {
  try {
    const docRef = await addDoc(collection(db, 'resumeSubmissions'), {
      ...studentData,
      resumeText,
      status: 'pending',
      submittedAt: new Date(),
      aiAnalysis: null,
      counselorReview: null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding resume submission:', error);
    throw error;
  }
};

export const getResumeSubmissions = async (status = null) => {
  try {
    let q = collection(db, 'resumeSubmissions');
    if (status) {
      q = query(q, where('status', '==', status));
    }
    q = query(q, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting resume submissions:', error);
    throw error;
  }
};

export const updateResumeSubmission = async (id, updates) => {
  try {
    const docRef = doc(db, 'resumeSubmissions', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating resume submission:', error);
    throw error;
  }
};

// Interview submissions collection
export const addInterviewSubmission = async (studentData, question, answer) => {
  try {
    const docRef = await addDoc(collection(db, 'interviewSubmissions'), {
      ...studentData,
      question,
      answer,
      status: 'pending',
      submittedAt: new Date(),
      aiScore: null,
      aiFeedback: null,
      counselorReview: null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding interview submission:', error);
    throw error;
  }
};

export const getInterviewSubmissions = async (status = null) => {
  try {
    let q = collection(db, 'interviewSubmissions');
    if (status) {
      q = query(q, where('status', '==', status));
    }
    q = query(q, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting interview submissions:', error);
    throw error;
  }
};

export const updateInterviewSubmission = async (id, updates) => {
  try {
    const docRef = doc(db, 'interviewSubmissions', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating interview submission:', error);
    throw error;
  }
};

// Career recommendations collection
export const addCareerRecommendation = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, 'careerRecommendations'), {
      ...studentData,
      status: 'pending',
      submittedAt: new Date(),
      aiRecommendation: null,
      counselorReview: null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding career recommendation:', error);
    throw error;
  }
};

export const getCareerRecommendations = async (status = null) => {
  try {
    let q = collection(db, 'careerRecommendations');
    if (status) {
      q = query(q, where('status', '==', status));
    }
    q = query(q, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting career recommendations:', error);
    throw error;
  }
};

export const updateCareerRecommendation = async (id, updates) => {
  try {
    const docRef = doc(db, 'careerRecommendations', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating career recommendation:', error);
    throw error;
  }
};