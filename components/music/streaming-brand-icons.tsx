import { siApplemusic, siSpotify } from "simple-icons";

import { cn } from "@/lib/utils";

type BrandKey = "spotify" | "appleMusic";

const brands: Record<
  BrandKey,
  { icon: typeof siSpotify; label: string }
> = {
  spotify: { icon: siSpotify, label: "Spotify" },
  appleMusic: { icon: siApplemusic, label: "Apple Music" }
};

export function StreamingBrandIcon({
  brand,
  className,
  decorative = true
}: {
  brand: BrandKey;
  className?: string;
  /** When true, hide from assistive tech (use beside visible service name). */
  decorative?: boolean;
}) {
  const { icon, label } = brands[brand];
  return (
    <svg
      role={decorative ? undefined : "img"}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden={decorative}
      aria-label={decorative ? undefined : label}
    >
      {!decorative ? <title>{label}</title> : null}
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}

export function streamingBrandHex(brand: BrandKey): string {
  return brands[brand].icon.hex;
}
