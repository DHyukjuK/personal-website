import { NextResponse } from "next/server";
import { getSpotifyPayload } from "@/lib/spotify";

export async function GET() {
  try {
    const payload = await getSpotifyPayload();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      {
        configured: false,
        listening: null,
        issue: "server_error" as const
      },
      { status: 503 }
    );
  }
}
