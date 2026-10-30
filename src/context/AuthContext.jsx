import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const C = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = () => {};
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      unsubProfile();
      unsubProfile = () => {};
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Live listener: the users/{uid} document may be created just after sign-up,
      // so a one-time read would wrongly return null.
      unsubProfile = onSnapshot(
        doc(db, 'users', u.uid),
        (s) => {
          setProfile(s.exists() ? { uid: s.id, ...s.data() } : null);
          setLoading(false);
        },
        () => {
          setProfile(null);
          setLoading(false);
        }
      );
    });
    return () => {
      unsubProfile();
      unsubAuth();
    };
  }, []);

  return <C.Provider value={{ user, profile, loading }}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);
