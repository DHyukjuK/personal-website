import { NextResponse } from "next/server";
import { getSpotifyListening } from "@/lib/spotify";

export async function GET() {
  try {
    const payload = await getSpotifyListening();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { configured: false, listening: null, error: "spotify_unavailable" },
      { status: 503 }
    );
  }
}
