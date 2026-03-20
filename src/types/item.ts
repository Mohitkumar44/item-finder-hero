export interface FoundItem {
  id: string;
  title: string;
  description: string;
  category: "Electronics" | "Pets" | "Keys" | "Wallet" | "Other";
  location: string;
  imageUrl: string;
  contactNumber: string;
  finderEmail: string;
  finderName: string;
  finderPhoto: string;
  userId: string;
  status: "active" | "found";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
}
