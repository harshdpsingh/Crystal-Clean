import { NextRequest, NextResponse } from "next/server";
import { updateSetting, getSettings } from "@/lib/supabase/admin";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await updateSetting(key, value);
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully." });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating settings." },
      { status: 500 }
    );
  }
}
