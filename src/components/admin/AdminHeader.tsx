"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem("crystal_clean_admin_session");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <header className="bg-white border-b border-border h-16 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 text-navy hover:text-teal"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs text-body-muted">
          <ShieldCheck className="w-4 h-4 text-teal" />
          <span className="font-semibold text-navy">Admin Management Session</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs text-body-muted hover:text-red-600 bg-offwhite hover:bg-red-50 px-3 py-1.5 rounded border border-border transition-colors font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
