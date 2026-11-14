import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { INITIAL_STAFF_MEMBERS } from '../data/initialData';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  activeRole: UserRole;
  setActiveRole: (role: UserRole, customUser?: UserProfile) => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string, phone: string, countryCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  switchDemoUser: (role: UserRole, customUser?: UserProfile) => void;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  super_admin: INITIAL_STAFF_MEMBERS[2], // Akash Jaffri
  staff: INITIAL_STAFF_MEMBERS[0],       // Hamza Farooq
  client: {
    uid: 'client-demo-01',
    fullName: 'Muhammad Bilal Khan',
    email: 'bilal.khan@example.com',
    phone: '+92 300 1234567',
    countryCode: '+92',
    role: 'client',
    language: 'en',
    isActive: true,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
};

export const DEMO_CLIENT_2: UserProfile = {
  uid: 'client-demo-02',
  fullName: 'Zainab Tariq',
  email: 'zainab.tariq@example.com',
  phone: '+92 321 9876543',
  countryCode: '+92',
  role: 'client',
  language: 'en',
  isActive: true,
  createdAt: '2026-02-20T11:00:00Z',
  updatedAt: '2026-03-08T10:00:00Z',
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gac_active_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.super_admin;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return currentUser?.role || 'super_admin';
  });

  const setActiveRole = (role: UserRole, customUser?: UserProfile) => {
    setActiveRoleState(role);
    const demoUser = customUser || DEMO_USERS[role];
    setCurrentUser(demoUser);
    localStorage.setItem('gac_active_user', JSON.stringify(demoUser));
  };

  const switchDemoUser = (role: UserRole, customUser?: UserProfile) => {
    setActiveRole(role, customUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // Check if user is bootstrapped super admin
          const isBootstrappedAdmin = fbUser.email?.toLowerCase() === 'akashjaffri72@gmail.com';
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setCurrentUser(data);
            setActiveRoleState(data.role);
            localStorage.setItem('gac_active_user', JSON.stringify(data));
          } else {
            // New user registration defaults strictly to client unless bootstrapped admin
            const newRole: UserRole = isBootstrappedAdmin ? 'super_admin' : 'client';
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Client User',
              email: fbUser.email || '',
              phone: '',
              countryCode: '+92',
              role: newRole,
              language: 'en',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            if (isBootstrappedAdmin) {
              await setDoc(doc(db, 'admins', fbUser.uid), { uid: fbUser.uid, email: fbUser.email });
            }
            setCurrentUser(newProfile);
            setActiveRoleState(newRole);
            localStorage.setItem('gac_active_user', JSON.stringify(newProfile));
          }
        } catch (e) {
          console.warn('Could not fetch user profile from Firestore, falling back to local session:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const isBootstrappedAdmin = cred.user.email?.toLowerCase() === 'akashjaffri72@gmail.com';
      let role: UserRole = isBootstrappedAdmin ? 'super_admin' : 'client';

      try {
        const snap = await getDoc(doc(db, 'users', cred.user.uid));
        if (snap.exists()) {
          const profile = snap.data() as UserProfile;
          setCurrentUser(profile);
          setActiveRoleState(profile.role);
          localStorage.setItem('gac_active_user', JSON.stringify(profile));
          return;
        }
      } catch (err) {
        console.warn('Firestore fetch failed on sign in', err);
      }

      const fallbackProfile: UserProfile = {
        uid: cred.user.uid,
        fullName: cred.user.displayName || email.split('@')[0],
        email: cred.user.email || email,
        phone: '',
        countryCode: '+92',
        role,
        language: 'en',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentUser(fallbackProfile);
      setActiveRoleState(role);
      localStorage.setItem('gac_active_user', JSON.stringify(fallbackProfile));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    fullName: string,
    phone: string,
    countryCode: string
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const isBootstrappedAdmin = email.toLowerCase() === 'akashjaffri72@gmail.com';
      // Prompt Rule: New registrations MUST receive CLIENT role by default
      const role: UserRole = isBootstrappedAdmin ? 'super_admin' : 'client';

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        fullName,
        email,
        phone,
        countryCode,
        role,
        language: 'en',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        if (isBootstrappedAdmin) {
          await setDoc(doc(db, 'admins', cred.user.uid), { uid: cred.user.uid, email });
        }
      } catch (e) {
        console.warn('Failed saving user document to Firestore, kept locally:', e);
      }

      setCurrentUser(newProfile);
      setActiveRoleState(role);
      localStorage.setItem('gac_active_user', JSON.stringify(newProfile));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setFirebaseUser(null);
    setCurrentUser(null);
    localStorage.removeItem('gac_active_user');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const verifyEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
    localStorage.setItem('gac_active_user', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore profile update failed, updated in local session:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        activeRole,
        setActiveRole,
        signIn,
        signUp,
        signOut,
        resetPassword,
        verifyEmail,
        switchDemoUser,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
