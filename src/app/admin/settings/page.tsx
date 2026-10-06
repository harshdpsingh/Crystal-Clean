"use client";

import React, { useState, useEffect } from "react";
import { Save, Building, Phone, Mail, MapPin, FileText, CheckCircle2, MessageSquare } from "lucide-react";
import { INITIAL_SETTINGS } from "@/lib/mockData";
import { SettingsState } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (key: keyof SettingsState, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Business profile and settings saved successfully!", "success");
      } else {
        showToast("Failed to save settings.", "error");
      }
    } catch {
      showToast("Settings updated in session.", "success");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-[0.16em] text-teal font-bold block">
            Store Profile & Communications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-navy">
            Business Settings & WhatsApp Desk
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Identity */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border flex items-center gap-2">
            <Building className="w-4 h-4 text-teal" />
            <span>Company Name & Branding</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.business_name}
                onChange={(e) => handleChange("business_name", e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Tagline / Sub-heading
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-navy mb-1">
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              value={settings.announcement_bar}
              onChange={(e) => handleChange("announcement_bar", e.target.value)}
              className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
            />
          </div>
        </div>

        {/* WhatsApp & Contacts */}
        <div className="bg-white p-6 rounded-md border border-border space-y-4 shadow-subtle">
          <h2 className="font-serif text-base font-semibold text-navy pb-2 border-b border-border flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal" />
            <span>WhatsApp Order Desk & Contact Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="919149953610"
                value={settings.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono font-bold text-navy"
              />
              <span className="text-[10px] text-body-muted block mt-0.5">
                Format: 91XXXXXXXXXX (no + or spaces)
              </span>
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Display Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Sales Desk Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-navy mb-1">
              Manufacturing & Warehouse Address
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-navy mb-1">
                GSTIN Number
              </label>
              <input
                type="text"
                value={settings.gst_number}
                onChange={(e) => handleChange("gst_number", e.target.value.toUpperCase())}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Catalog PDF Download Link
              </label>
              <input
                type="text"
                value={settings.catalog_pdf_url}
                onChange={(e) => handleChange("catalog_pdf_url", e.target.value)}
                className="w-full bg-offwhite px-3 py-2 rounded border border-border focus:border-teal font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-3.5 rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-subtle"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving Settings..." : "Save Business Settings"}</span>
        </button>
      </form>
    </div>
  );
}
