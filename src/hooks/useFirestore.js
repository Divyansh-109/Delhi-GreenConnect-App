import { useState, useCallback } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useFirestore() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPost = async (text) => {
    if (!currentUser) throw new Error("Must be logged in to post");
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        authorId: currentUser.uid,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        text,
        timestamp: serverTimestamp()
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const submitEvent = async (eventData) => {
    if (!currentUser) throw new Error("Must be logged in to organize an event");
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        organizerId: currentUser.uid,
        organizerName: currentUser.name,
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        status: 'pending_approval',
        createdAt: serverTimestamp()
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const submitReport = async (reportData) => {
    if (!currentUser) throw new Error("Must be logged in to report");
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        reporterId: currentUser.uid,
        type: reportData.type, // 'issue' or 'discovery'
        description: reportData.description,
        imageUrl: reportData.imageUrl || null,
        location: reportData.location || null, // expects { lat, lng }
        status: 'open',
        timestamp: serverTimestamp()
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const subscribeToPosts = useCallback((callback) => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(posts);
    }, (err) => console.error("Snapshot error:", err));
  }, []);

  return { addPost, submitEvent, submitReport, subscribeToPosts, loading, error };
}
