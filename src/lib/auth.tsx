import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/src/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  goal?: string;
  activityLevel?: string;
  lastLogin?: { seconds: number; nanoseconds: number } | null;
  updatedAt?: { seconds: number; nanoseconds: number } | null;
  subscriptionStatus?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (authUser) {
        try {
          profileUnsubscribe = onSnapshot(doc(db, 'users', authUser.uid), (docSnap) => {
            setProfile(docSnap.data() as UserProfile || null);
            setLoading(false);
          }, (error) => {
            console.error("Profile sync error:", error);
            setLoading(false);
          });
        } catch (error) {
          console.error("Failed to set up profile listener:", error);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
