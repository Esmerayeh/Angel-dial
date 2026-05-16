"use client";

import { clockRooms } from "@/data/worlds";

const coreInteractions = [
  ["Rotate the Dial", "Change world"],
  ["Pull the Ghost", "Open a veil door"],
  ["Tune the Radio", "Find frequencies"],
  ["Use the Chain", "Travel vertically"],
  ["Open Objects", "Enter inside worlds"],
  ["Leave a Relic", "Add to the wall"],
];

const insideWorlds = [
  ["CD Tray City", "Tiny cyber town inside a disc"],
  ["Bottle Message Room", "Read letters from the deep"],
  ["Clockwork Interior", "Gears, watches, and secrets"],
  ["Popup Interior", "A chapel of soft warnings"],
  ["Ghost Interior", "Doors and moths behind the veil"],
  ["Tiny Website Shrine", "Sacred corners of the web"],
];

const transitions = [
  ["Clock Bloom", "Petals open"],
  ["Ghost Veil", "Silk becomes a door"],
  ["Elevator Drift", "Floors drift like memories"],
  ["Radio Wave", "Signal becomes a room"],
  ["Object Entry", "Enter the inside"],
  ["Water Ripple", "Steps become ripples"],
];

const artifacts = ["Relic Charms", "Pressed Flowers", "Pixel Stickers", "Moon Pearls", "Dream Notes", "Visitor Keepsakes"];

export default function WorldChart({ mode = "full" }: { mode?: "full" | "mini" }) {
  const leftRooms = clockRooms.filter((room) => room.index > 0 && room.index <= 5);
  const rightRooms = clockRooms.filter((room) => room.index >= 6 || room.index === 0);

  return (
    <div className={`world-chart world-chart--${mode}`} aria-label="Angel Dial world chart">
      <header className="world-chart__header">
        <div>
          <p>ANGEL DIAL</p>
          <h2>WORLD CHART / 12 ROOMS</h2>
        </div>
        <span>A soft haunted internet instrument. Turn, pull, tune, open, and drift.</span>
      </header>

      <div className="world-chart__body">
        <div className="world-chart__room-list world-chart__room-list--left">
          {leftRooms.map((room) => (
            <article key={room.id} className="world-chart__room-card">
              <span className="world-chart__number">{room.index}</span>
              <div className="world-chart__thumb" aria-hidden="true">
                <i />
              </div>
              <h3>{room.name}</h3>
              <small>{room.subtitle}</small>
              <p>{room.description}</p>
              <b>{room.interaction}</b>
            </article>
          ))}
        </div>

        <div className="world-chart__map">
          <div className="world-chart__sky" aria-hidden="true" />
          <div className="world-chart__dial" aria-hidden="true">
            {clockRooms.map((room) => (
              <span
                key={room.id}
                className="world-chart__marker"
                style={{ "--marker-angle": `${room.index * 30}deg`, "--marker-counter": `${room.index * -30}deg` } as React.CSSProperties}
              >
                <em>{room.index === 0 ? 12 : room.index}</em>
              </span>
            ))}
            <strong>SERAPH-404</strong>
          </div>
          <p className="world-chart__center-note">Every turn is a choice. Every room remembers you.</p>
        </div>

        <div className="world-chart__room-list world-chart__room-list--right">
          {rightRooms.map((room) => (
            <article key={room.id} className="world-chart__room-card">
              <span className="world-chart__number">{room.index === 0 ? 12 : room.index}</span>
              <div className="world-chart__thumb" aria-hidden="true">
                <i />
              </div>
              <h3>{room.name}</h3>
              <small>{room.subtitle}</small>
              <p>{room.description}</p>
              <b>{room.interaction}</b>
            </article>
          ))}
        </div>
      </div>

      {mode === "full" ? (
        <footer className="world-chart__footer">
          <section>
            <h3>Core Interactions</h3>
            <ul>
              {coreInteractions.map(([name, text]) => (
                <li key={name}>
                  <span />
                  <b>{name}</b>
                  <small>{text}</small>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Inside Worlds</h3>
            <ul>
              {insideWorlds.map(([name, text]) => (
                <li key={name}>
                  <span />
                  <b>{name}</b>
                  <small>{text}</small>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Transitions</h3>
            <ul>
              {transitions.map(([name, text]) => (
                <li key={name}>
                  <span />
                  <b>{name}</b>
                  <small>{text}</small>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Artifact System</h3>
            <ul>
              {artifacts.map((name) => (
                <li key={name}>
                  <span />
                  <b>{name}</b>
                  <small>Collect, leave, and evolve.</small>
                </li>
              ))}
            </ul>
          </section>
        </footer>
      ) : null}
    </div>
  );
}
