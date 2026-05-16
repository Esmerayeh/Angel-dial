"use client";

import { create } from "zustand";
import { artifactSeeds } from "@/data/artifactSeeds";

export type AnonymousArtifact = {
  id: string;
  text: string;
  place: string;
  alias: string;
  createdAt: string;
};

type ArtifactStore = {
  artifacts: AnonymousArtifact[];
  initialized: boolean;
  initializeArtifacts: () => void;
  leaveArtifact: (artifact: Omit<AnonymousArtifact, "id" | "createdAt">) => void;
};

const storageKey = "angel-dial-anonymous-artifacts";

function readArtifacts() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as AnonymousArtifact[];
  } catch {
    return [];
  }
}

function writeArtifacts(artifacts: AnonymousArtifact[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(artifacts.slice(-24)));
  }
}

export const useArtifactStore = create<ArtifactStore>((set, get) => ({
  artifacts: [],
  initialized: false,
  initializeArtifacts: () => {
    if (get().initialized) {
      return;
    }

    const localArtifacts = readArtifacts();
    const seededArtifacts = artifactSeeds.map((seed, index) => ({
      id: `seed-${index}`,
      text: seed.text,
      place: seed.place,
      alias: seed.alias,
      createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
    }));
    set({ artifacts: [...seededArtifacts, ...localArtifacts], initialized: true });
  },
  leaveArtifact: (artifact) =>
    set((state) => {
      const next = [
        ...state.artifacts,
        {
          ...artifact,
          id: `artifact-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          createdAt: new Date().toISOString(),
        },
      ];
      writeArtifacts(next);
      return { artifacts: next };
    }),
}));
