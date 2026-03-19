import { MapPin, Calendar, Tag } from "lucide-react";
import type { FoundItem } from "@/types/item";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: FoundItem;
  onClick: () => void;
  index: number;
}

const ItemCard = ({ item, onClick, index }: ItemCardProps) => {
  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-heading font-semibold text-foreground truncate">{item.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Tag className="h-3.5 w-3.5" />
          <span>{item.category}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
