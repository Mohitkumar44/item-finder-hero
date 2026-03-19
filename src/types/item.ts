export interface FoundItem {
  id: string;
  title: string;
  description: string;
  category: "Electronics" | "Pets" | "Keys" | "Wallet" | "Other";
  location: string;
  imageUrl: string;
  finderEmail: string;
  finderName: string;
  finderPhoto: string;
  createdAt: string;
}
