"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { LogOut, Activity } from "lucide-react";

export function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />
          <span className="font-bold text-lg tracking-tight">Incidents</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-neutral-600 dark:text-neutral-400">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
