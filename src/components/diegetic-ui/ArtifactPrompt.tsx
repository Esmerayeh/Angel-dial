"use client";

import { useMemo, useState } from "react";
import { artifactPlaces } from "@/data/microcopy";
import { useArtifactStore } from "@/store/useArtifactStore";
import { useRotWallStore } from "@/store/useRotWallStore";
import { useWorldStore } from "@/store/useWorldStore";
import { pickArtifactPlace, sanitizeArtifactText } from "@/systems/artifactSystem";

export default function ArtifactPrompt() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const leaveArtifact = useArtifactStore((state) => state.leaveArtifact);
  const addArtifactRelic = useRotWallStore((state) => state.addArtifactRelic);
  const artifacts = useArtifactStore((state) => state.artifacts);
  const alias = useWorldStore((state) => state.visitorAlias);
  const currentMood = useWorldStore((state) => state.currentMood);
  const dailySeed = useWorldStore((state) => state.dailyMutationSeed);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const place = useMemo(() => pickArtifactPlace(dailySeed + text.length), [dailySeed, text.length]);

  function submitArtifact() {
    const cleaned = sanitizeArtifactText(text);
    if (!cleaned) {
      setSeraphLine("The machine cannot store an empty relic. It listened anyway.");
      return;
    }

    const createdAt = new Date().toISOString();
    leaveArtifact({ text: cleaned, place, alias });
    addArtifactRelic({ id: `artifact-${createdAt}`, text: cleaned, place, alias, createdAt }, currentMood);
    setSeraphLine("You offered a sentence. The Reliquary Wall will keep it softly.");
    setText("");
    setOpen(false);
  }

  return (
    <div className={`artifact-prompt ${open ? "artifact-prompt--open" : ""}`}>
      <button className="artifact-prompt__tab" type="button" onClick={() => setOpen((value) => !value)}>
        LEAVE SOMETHING BEHIND
      </button>
      {open ? (
        <div className="artifact-prompt__body">
          <p>This will not belong to you after you leave it. It will become part of the machine.</p>
          <textarea
            aria-label="Anonymous artifact text"
            value={text}
            maxLength={180}
            onChange={(event) => setText(event.target.value)}
            placeholder="three words, tiny poem, dream note, strange object..."
          />
          <div className="artifact-prompt__places">
            {artifactPlaces.slice(0, 5).map((artifactPlace) => (
              <span key={artifactPlace} className={artifactPlace === place ? "is-active" : ""}>
                {artifactPlace}
              </span>
            ))}
          </div>
          <button type="button" onClick={submitArtifact}>
            HIDE IN {place.toUpperCase()}
          </button>
        </div>
      ) : null}
      <div className="artifact-orbit" aria-label="Discovered anonymous artifacts">
        {artifacts.slice(-8).map((artifact, index) => (
          <span key={artifact.id} style={{ "--i": index } as React.CSSProperties} title={`${artifact.alias}: ${artifact.text}`}>
            {artifact.place}
          </span>
        ))}
      </div>
    </div>
  );
}
