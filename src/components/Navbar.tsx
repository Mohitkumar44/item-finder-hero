import { Search, LogIn, LogOut, Plus, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onReportClick: () => void;
}

const Navbar = ({ onReportClick }: NavbarProps) => {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">FindIt</span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Button onClick={onReportClick} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Report Found</span>
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || ""}
                alt={user.displayName || "User"}
                className="h-8 w-8 rounded-full border-2 border-border"
              />
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={signInWithGoogle} className="gap-1.5">
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
