"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoginPage) {
    return <div className="min-h-screen bg-offwhite flex flex-col justify-center">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-offwhite flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 bottom-0 w-64">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-navy/60 backdrop-blur-xs flex">
          <div className="w-64 max-w-full">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
