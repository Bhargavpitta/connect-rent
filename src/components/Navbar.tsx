import { Link, NavLink, useNavigate } from "react-router-dom";
import { Radio, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/rent", label: "Rent Now" },
    ...(role === "admin" ? [{ to: "/admin", label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-lg group-hover:bg-primary/60 transition" />
              <Radio className="relative h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              WalkieTalkie<span className="text-gradient">RentalsIndia</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive ? "bg-primary/15 text-primary" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
                <LogOut className="h-4 w-4 mr-1" /> Sign out
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate("/auth")} className="rounded-full">
                Login
              </Button>
            )}
            <Button size="sm" onClick={() => navigate("/rent")} className="rounded-full bg-primary hover:bg-primary/90 hidden sm:inline-flex">
              Rent Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
