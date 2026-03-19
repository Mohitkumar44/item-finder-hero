import { X, MapPin, Calendar, Tag, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FoundItem } from "@/types/item";
import { motion, AnimatePresence } from "framer-motion";

interface ItemModalProps {
  item: FoundItem | null;
  onClose: () => void;
}

const ItemModal = ({ item, onClose }: ItemModalProps) => {
  if (!item) return null;

  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-modal"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-card/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>

          <div className="aspect-video overflow-hidden bg-muted">
            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <div className="p-6 space-y-4">
            <h2 className="font-heading text-2xl font-bold text-foreground">{item.title}</h2>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <Tag className="h-3.5 w-3.5" /> {item.category}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <MapPin className="h-3.5 w-3.5" /> {item.location}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <Calendar className="h-3.5 w-3.5" /> {date}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-secondary-foreground">{item.description}</p>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
              <img
                src={item.finderPhoto}
                alt={item.finderName}
                className="h-10 w-10 rounded-full border-2 border-border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {item.finderName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{item.finderEmail}</p>
              </div>
            </div>

            <Button asChild className="w-full gap-2">
              <a href={`mailto:${item.finderEmail}?subject=Inquiry about: ${item.title}`}>
                <Mail className="h-4 w-4" />
                Message Finder
              </a>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItemModal;
