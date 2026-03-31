import { NextResponse } from "next/server";
import { getSpotifyNowPayload } from "@/lib/spotify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const body = await getSpotifyNowPayload();
  return NextResponse.json(body);
}
