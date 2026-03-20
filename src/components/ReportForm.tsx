import { useState, useRef, useCallback } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { createItem } from "@/hooks/useItems";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
const CLOUDINARY_CLOUD_NAME = "dymnz91fx";
const CLOUDINARY_UPLOAD_PRESET = "findit";

const CATEGORIES = ["Electronics", "Pets", "Keys", "Wallet", "Other"] as const;

interface ReportFormProps {
  open: boolean;
  onClose: () => void;
}

const ReportForm = ({ open, onClose }: ReportFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "" as string,
    location: "",
    imageUrl: "",
  });

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
      setImagePreview(data.secure_url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.category) return;

    setLoading(true);
    try {
      await createItem({
        title: form.title,
        description: form.description,
        category: form.category as any,
        location: form.location,
        imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600",
        finderEmail: user.email || "",
        finderName: user.displayName || "Anonymous",
        finderPhoto: user.photoURL || "",
      });
      toast.success("Item reported successfully!");
      setForm({ title: "", description: "", category: "", location: "", imageUrl: "" });
      setImagePreview(null);
      onClose();
    } catch {
      toast.error("Failed to report item");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="h-full w-full max-w-md overflow-y-auto bg-card shadow-modal"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-heading text-lg font-bold text-foreground">Report Found Item</h2>
            <button type="button" onClick={onClose} className="rounded-full p-1.5 transition-colors hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input
                id="title"
                required
                placeholder="e.g. Black iPhone 15"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                placeholder="Describe the item, where you found it..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Found</Label>
              <Input
                id="location"
                required
                placeholder="e.g. Central Park, Bench #12"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Item Photo</Label>
              {imagePreview ? (
                <div className="relative rounded-lg border border-border overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1 text-background transition-colors hover:bg-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted p-3">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Drop an image here or <span className="text-primary">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || uploading}>
              {loading ? "Submitting..." : "Report Item"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportForm;
