import { useState, useMemo } from "react";
import { useItems } from "@/hooks/useItems";
import Navbar from "@/components/Navbar";
import SearchFilterBar from "@/components/SearchFilterBar";
import ItemCard from "@/components/ItemCard";
import ItemModal from "@/components/ItemModal";
import ReportForm from "@/components/ReportForm";
import type { FoundItem } from "@/types/item";
import { PackageSearch } from "lucide-react";

const Index = () => {
  const { items, loading } = useItems();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onReportClick={() => setReportOpen(true)} />

      <main className="container py-6 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Lost something? Let's <span className="text-primary">find it.</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse found items or sign in to report something you've found.
          </p>
        </div>

        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border bg-card">
                <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="font-heading text-lg font-semibold text-foreground">No items found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length === 0
                ? "Be the first to report a found item!"
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </main>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <ReportForm open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
};

export default Index;
