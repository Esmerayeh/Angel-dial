import { artifactPlaces } from "@/data/microcopy";

export function sanitizeArtifactText(text: string) {
  return text.replace(/[<>]/g, "").trim().slice(0, 180);
}

export function pickArtifactPlace(seed: number) {
  return artifactPlaces[Math.abs(seed) % artifactPlaces.length];
}
