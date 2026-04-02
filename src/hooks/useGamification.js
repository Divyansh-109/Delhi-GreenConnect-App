import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc, increment, arrayUnion } from 'firebase/firestore';

export function useGamification() {
  const { currentUser } = useAuth();
  const [badges, setBadges] = useState([]);
  const [points, setPoints] = useState(0);
  const [showBanner, setShowBanner] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBadges(data.earnedBadges || []);
        setPoints(data.greenPoints || 0);
      }
    });
    return () => unsub();
  }, [currentUser]);

  const awardPoint = async (amount = 10, reason = "Discovering Park Space") => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        greenPoints: increment(amount)
      }, { merge: true });
      setShowBanner({ title: 'Points Claimed!', description: `+${amount} pts for ${reason}` });
      setTimeout(() => setShowBanner(null), 3000);
    } catch (error) {
      console.error("Gamification error:", error);
    }
  };

  const awardBadge = async (badgeName) => {
    if (!currentUser) return;
    if (badges.includes(badgeName)) return; // Already earned
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        earnedBadges: arrayUnion(badgeName)
      }, { merge: true });
      setShowBanner({ title: 'New Badge Unlocked!', description: `You earned: ${badgeName}` });
      setTimeout(() => setShowBanner(null), 4000);
    } catch (error) {
      console.error("Badge error:", error);
    }
  };

  const clearBanner = () => setShowBanner(null);

  return { badges, points, awardPoint, awardBadge, showBanner, clearBanner };
}
