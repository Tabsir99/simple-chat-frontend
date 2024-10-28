import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { 
  signInWithCustomToken, 
  signOut as firebaseSignOut, 
} from "firebase/auth";
import { storage,auth } from "./firebaseConfig";
import { useState, useCallback } from 'react';

export const useFirebase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sign in with custom token
  const signIn = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithCustomToken(auth, token);
      return userCredential.user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file: File, path: string) => {
    setLoading(true);
    setError(null);
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload file'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get file URL
  const getFileURL = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get file URL'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete file
  const deleteFile = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete file'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    signIn,
    signOut,
    uploadFile,
    getFileURL,
    deleteFile
  };
};