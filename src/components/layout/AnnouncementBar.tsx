import React from "react";

interface AnnouncementBarProps {
  text?: string;
}

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  if (!text) return null;

  return (
    <aside aria-label="Announcement" className="bg-navy text-white text-[13px] py-1.5 px-4 text-center font-normal tracking-wide border-b border-navy-light">
      <div className="max-w-site mx-auto flex items-center justify-center gap-2">
        <span>{text}</span>
      </div>
    </aside>
  );
}
