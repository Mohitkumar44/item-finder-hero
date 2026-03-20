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
import type { ChatMessage } from "@/types/item";

export const sendMessage = async (
  itemId: string,
  text: string,
  senderId: string,
  senderName: string
) => {
  await addDoc(collection(db, "items", itemId, "messages"), {
    text,
    senderId,
    senderName,
    timestamp: serverTimestamp(),
  });
};

export const useChat = (itemId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!itemId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "items", itemId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp:
          doc.data().timestamp?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      })) as ChatMessage[];
      setMessages(data);
    });

    return unsub;
  }, [itemId]);

  return { messages };
};
