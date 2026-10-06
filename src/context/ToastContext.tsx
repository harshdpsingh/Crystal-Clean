"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-md border shadow-card transition-all duration-300 ${
              toast.type === "success"
                ? "bg-white border-teal text-navy"
                : toast.type === "error"
                ? "bg-white border-red-500 text-red-900"
                : "bg-white border-navy text-navy"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" strokeWidth={1.5} />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" strokeWidth={1.5} />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-navy shrink-0 mt-0.5" strokeWidth={1.5} />
            )}
            <p className="text-sm font-medium leading-tight flex-1 text-[#3D4852]">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6B7280] hover:text-navy transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
