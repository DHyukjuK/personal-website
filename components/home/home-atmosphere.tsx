import { DriftingParticles } from "@/components/home/drifting-particles";

/**
 * Full-viewport ambient layer for the homepage: soft gradients, slow drift,
 * grain, vignette, and floating particles.
 */
export function HomeAtmosphere() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="home-atmosphere-base absolute inset-0" />
      <div className="home-atmosphere-orb home-atmosphere-orb-a" />
      <div className="home-atmosphere-orb home-atmosphere-orb-b" />
      <div className="home-atmosphere-orb home-atmosphere-orb-c" />
      <div className="home-atmosphere-grain absolute inset-0" />
      <div className="home-atmosphere-vignette absolute inset-0" />
      <DriftingParticles />
    </div>
  );
}
