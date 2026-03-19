import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FoundItem } from "@/types/item";

export const createItem = async (item: Omit<FoundItem, "id" | "createdAt">) => {
  await addDoc(collection(db, "items"), {
    ...item,
    createdAt: serverTimestamp(),
  });
};

export const useItems = () => {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as FoundItem[];

        setItems(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return unsub;
  }, []);

  return { items, loading };
};
