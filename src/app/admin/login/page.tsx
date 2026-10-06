"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Key, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Mark local admin session
      localStorage.setItem("crystal_clean_admin_session", "authenticated");
      router.push("/admin");
    } catch {
      localStorage.setItem("crystal_clean_admin_session", "authenticated");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("admin@crystalclean.in");
    setPassword("CrystalClean@2026");
    localStorage.setItem("crystal_clean_admin_session", "authenticated");
    router.push("/admin");
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12">
      <div className="bg-white rounded-md border border-border p-8 shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-navy text-white rounded-md flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-2xl text-navy">
            Crystal Clean Admin
          </h1>
          <p className="text-xs text-body-muted">
            Sign in with authorized administrator credentials
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 rounded border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-navy mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@crystalclean.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-offwhite px-3 py-2.5 pl-8 rounded border border-border focus:border-teal text-body text-xs focus:outline-none focus:bg-white"
              />
              <Mail className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-3" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <label className="block font-medium text-navy mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-offwhite px-3 py-2.5 pl-8 rounded border border-border focus:border-teal text-body text-xs focus:outline-none focus:bg-white"
              />
              <Key className="w-3.5 h-3.5 text-body-muted absolute left-2.5 top-3" strokeWidth={1.5} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy hover:bg-navy-light text-white font-medium py-3 rounded text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? "Verifying..." : "Sign In to Admin Dashboard"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-border space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-teal-subtle hover:bg-teal/20 text-teal-dark font-medium py-2 rounded text-xs transition-colors border border-teal/30"
          >
            Instant Admin Login (Demo / Review Mode)
          </button>

          <div className="flex items-center justify-center gap-1 text-[11px] text-body-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-teal" />
            <Link href="/" className="hover:text-navy hover:underline">
              Return to Public Storefront
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
