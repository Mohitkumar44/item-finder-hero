import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const isMobileDevice = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

const getAuthErrorMessage = (error: unknown) => {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
    return "Popup was blocked, redirecting you to Google sign-in.";
  }

  if (code === "auth/popup-closed-by-user") {
    return "Google sign-in was closed before it finished.";
  }

  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Auth yet. Add your Lovable preview and published domains in Firebase Authentication → Settings → Authorized domains.";
  }

  if (code === "auth/operation-not-allowed") {
    return "Google sign-in is not enabled in Firebase Authentication yet.";
  }

  return "Google sign-in failed. Please try again.";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    googleProvider.setCustomParameters({ prompt: "select_account" });

    setPersistence(auth, browserLocalPersistence).catch(() => undefined);

    getRedirectResult(auth).catch((error) => {
      toast.error(getAuthErrorMessage(error));
    });

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (isMobileDevice()) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        toast.info("Popup blocked, switching to redirect sign-in.");
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      toast.error(getAuthErrorMessage(error));
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
