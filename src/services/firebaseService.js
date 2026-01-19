import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

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

// Helper function to get user-specific collection
const getUserCollection = (userId, collectionName) => {
  return collection(db, 'users', userId, collectionName);
};

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

// ===== USER DATA PERSISTENCE FUNCTIONS =====

// Job Tracker Dashboard
export const saveJobApplication = async (userId, jobData) => {
  try {
    const userJobsRef = getUserCollection(userId, 'jobApplications');
    const docRef = await addDoc(userJobsRef, {
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving job application:', error);
    throw error;
  }
};

export const getJobApplications = async (userId) => {
  try {
    const userJobsRef = getUserCollection(userId, 'jobApplications');
    const q = query(userJobsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting job applications:', error);
    throw error;
  }
};

export const updateJobApplication = async (userId, jobId, updates) => {
  try {
    const jobRef = doc(db, 'users', userId, 'jobApplications', jobId);
    await updateDoc(jobRef, { ...updates, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating job application:', error);
    throw error;
  }
};

export const deleteJobApplication = async (userId, jobId) => {
  try {
    const jobRef = doc(db, 'users', userId, 'jobApplications', jobId);
    await deleteDoc(jobRef);
  } catch (error) {
    console.error('Error deleting job application:', error);
    throw error;
  }
};

// Resume Dashboard
export const saveResumeDraft = async (userId, resumeData) => {
  try {
    const userResumesRef = getUserCollection(userId, 'resumeDrafts');
    const docRef = await addDoc(userResumesRef, {
      ...resumeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving resume draft:', error);
    throw error;
  }
};

export const getResumeDrafts = async (userId) => {
  try {
    const userResumesRef = getUserCollection(userId, 'resumeDrafts');
    const q = query(userResumesRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting resume drafts:', error);
    throw error;
  }
};

export const updateResumeDraft = async (userId, resumeId, updates) => {
  try {
    const resumeRef = doc(db, 'users', userId, 'resumeDrafts', resumeId);
    await updateDoc(resumeRef, { ...updates, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating resume draft:', error);
    throw error;
  }
};

// Interview Dashboard
export const saveInterviewSession = async (userId, sessionData) => {
  try {
    const userSessionsRef = getUserCollection(userId, 'interviewSessions');
    const docRef = await addDoc(userSessionsRef, {
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving interview session:', error);
    throw error;
  }
};

export const getInterviewSessions = async (userId) => {
  try {
    const userSessionsRef = getUserCollection(userId, 'interviewSessions');
    const q = query(userSessionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting interview sessions:', error);
    throw error;
  }
};

export const updateInterviewSession = async (userId, sessionId, updates) => {
  try {
    const sessionRef = doc(db, 'users', userId, 'interviewSessions', sessionId);
    await updateDoc(sessionRef, { ...updates, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating interview session:', error);
    throw error;
  }
};

// Career Predictor Dashboard
export const saveCareerAssessment = async (userId, assessmentData) => {
  try {
    const userAssessmentsRef = getUserCollection(userId, 'careerAssessments');
    const docRef = await addDoc(userAssessmentsRef, {
      ...assessmentData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving career assessment:', error);
    throw error;
  }
};

export const getCareerAssessments = async (userId) => {
  try {
    const userAssessmentsRef = getUserCollection(userId, 'careerAssessments');
    const q = query(userAssessmentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting career assessments:', error);
    throw error;
  }
};

// Course Recommender Dashboard
export const saveLearningPath = async (userId, pathData) => {
  try {
    const userPathsRef = getUserCollection(userId, 'learningPaths');
    const docRef = await addDoc(userPathsRef, {
      ...pathData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving learning path:', error);
    throw error;
  }
};

export const getLearningPaths = async (userId) => {
  try {
    const userPathsRef = getUserCollection(userId, 'learningPaths');
    const q = query(userPathsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting learning paths:', error);
    throw error;
  }
};

export const updateLearningPath = async (userId, pathId, updates) => {
  try {
    const pathRef = doc(db, 'users', userId, 'learningPaths', pathId);
    await updateDoc(pathRef, { ...updates, updatedAt: new Date() });
  } catch (error) {
    console.error('Error updating learning path:', error);
    throw error;
  }
};

// Student Analytics Dashboard
export const savePerformanceData = async (userId, performanceData) => {
  try {
    const userPerformanceRef = getUserCollection(userId, 'performanceData');
    const docRef = await addDoc(userPerformanceRef, {
      ...performanceData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving performance data:', error);
    throw error;
  }
};

export const getPerformanceData = async (userId) => {
  try {
    const userPerformanceRef = getUserCollection(userId, 'performanceData');
    const q = query(userPerformanceRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting performance data:', error);
    throw error;
  }
};

// Real-time listeners for offline sync
export const subscribeToUserData = (userId, collectionName, callback) => {
  const userCollectionRef = getUserCollection(userId, collectionName);
  const q = query(userCollectionRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  }, (error) => {
    console.error(`Error subscribing to ${collectionName}:`, error);
  });
};