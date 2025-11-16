import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Home, Gamepad2, LogIn, UserPlus, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Toolbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/configure-game", label: "Game", icon: Gamepad2 },
    { path: "/login", label: "Login", icon: LogIn },
    { path: "/register", label: "Register", icon: UserPlus },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div
            className="flex items-center gap-2"
            onClick={() => handleNavigate("/")}
          >
            <div className="text-2xl font-bold text-primary">🎯</div>
            <span className="text-lg font-semibold text-foreground">
              Dart Game
            </span>
          </div>

          <div className="hidden md:flex gap-1 sm:gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(path)}
                className={cn("gap-2", isActive(path) && "shadow-md")}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Button>
            ))}
          </div>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu
                </SheetDescription>
                <div className="mt-8 flex flex-col gap-2">
                  {navItems.map(({ path, label, icon: Icon }) => (
                    <Button
                      key={path}
                      variant={isActive(path) ? "default" : "ghost"}
                      className="w-full justify-start gap-3 text-base"
                      onClick={() => handleNavigate(path)}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
