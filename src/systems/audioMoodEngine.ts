"use client";

import type { MoodId, WorldId } from "@/data/worlds";

type EngineNodes = {
  context: AudioContext;
  master: GainNode;
  drone: OscillatorNode;
  tick: OscillatorNode;
  noise: AudioBufferSourceNode;
  noiseGain: GainNode;
  portalBass: OscillatorNode;
  portalGain: GainNode;
  filter: BiquadFilterNode;
  highpass: BiquadFilterNode;
};

type RuntimeAudioParams = {
  world: WorldId;
  mood: MoodId;
  audioIntensity: number;
  portalPull: number;
  ghostTension: number;
  radioFrequency: number;
  elevatorHeight: number;
  transitionProgress: number;
  glitchPressure: number;
  pitchBend: number;
  filterSweep: number;
  rotWallDecay: number;
};

const worldFrequencies: Record<WorldId, number> = {
  "angel-dial": 196,
  "cyber-goth-mall": 247,
  "archive-ocean": 174,
  "angel-server-cathedral": 220,
  "forgotten-orrery": 208,
  "memory-hospital": 185,
  "rot-wall": 233,
  "floor-null": 164,
  "login-chapel": 262,
  "malware-chapel": 277,
  "black-desktop": 196,
  "gif-conservatory": 294,
  "red-chatrooms": 233,
};

const moodFilters: Record<MoodId, number> = {
  haunted: 1120,
  playful: 2200,
  tender: 1540,
  cursed: 860,
  chaotic: 2600,
  lonely: 1080,
  holy: 1840,
  romantic: 1680,
  glitchy: 2100,
  feral: 920,
};

class AudioMoodEngine {
  private nodes?: EngineNodes;

  async start() {
    if (typeof window === "undefined" || this.nodes) {
      return;
    }

    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const drone = context.createOscillator();
    const tick = context.createOscillator();
    const tickGain = context.createGain();
    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    const noise = context.createBufferSource();
    const noiseGain = context.createGain();
    const portalBass = context.createOscillator();
    const portalGain = context.createGain();
    const highpass = context.createBiquadFilter();

    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = Math.random() * 2 - 1;
    }

    master.gain.value = 0.018;
    filter.type = "lowpass";
    filter.frequency.value = 1420;
    highpass.type = "highpass";
    highpass.frequency.value = 42;
    drone.type = "sine";
    drone.frequency.value = 196;
    tick.type = "triangle";
    tick.frequency.value = 523.25;
    tickGain.gain.value = 0.0012;
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noiseGain.gain.value = 0.0001;
    portalBass.type = "sine";
    portalBass.frequency.value = 196;
    portalGain.gain.value = 0.0001;

    drone.connect(filter);
    tick.connect(tickGain);
    tickGain.connect(filter);
    noise.connect(noiseGain);
    noiseGain.connect(filter);
    portalBass.connect(portalGain);
    portalGain.connect(highpass);
    filter.connect(highpass);
    highpass.connect(master);
    master.connect(context.destination);
    drone.start();
    tick.start();
    noise.start();
    portalBass.start();

    this.nodes = { context, master, drone, tick, noise, noiseGain, portalBass, portalGain, filter, highpass };
  }

  setMuted(muted: boolean) {
    if (!this.nodes) {
      return;
    }
    this.nodes.master.gain.setTargetAtTime(muted ? 0 : 0.024, this.nodes.context.currentTime, 0.12);
  }

  update(world: WorldId, mood: MoodId, intensity: number) {
    if (!this.nodes) {
      return;
    }

    const now = this.nodes.context.currentTime;
    this.nodes.drone.frequency.setTargetAtTime(worldFrequencies[world] ?? 98, now, 0.2);
    this.nodes.tick.frequency.setTargetAtTime((worldFrequencies[world] ?? 196) * 2 + intensity * 120, now, 0.12);
    this.nodes.filter.frequency.setTargetAtTime(moodFilters[mood] ?? 680, now, 0.2);
    this.nodes.master.gain.setTargetAtTime(0.014 + intensity * 0.014, now, 0.18);
  }

  updateRuntime(params: RuntimeAudioParams) {
    if (!this.nodes) {
      return;
    }

    const now = this.nodes.context.currentTime;
    const baseFrequency = worldFrequencies[params.world] ?? 98;
    const pitch = Math.min(1.7, 1 + params.pitchBend * 0.22 + params.portalPull * 0.08 - params.elevatorHeight * 0.06);
    const filterTarget =
      (moodFilters[params.mood] ?? 680) +
      params.filterSweep * 900 +
      params.transitionProgress * 340 -
      params.ghostTension * 120 -
      params.rotWallDecay * 80;
    const staticAmount = Math.min(
      0.006,
      0.0002 + params.glitchPressure * 0.0018 + (params.radioFrequency / 100) * 0.0024 + params.rotWallDecay * 0.0012,
    );
    const portalAmount = Math.min(0.018, 0.001 + params.portalPull * 0.011 + params.transitionProgress * 0.006);

    this.nodes.drone.frequency.setTargetAtTime(baseFrequency * pitch, now, 0.08);
    this.nodes.tick.frequency.setTargetAtTime(baseFrequency * 2 + params.audioIntensity * 180 + params.pitchBend * 90, now, 0.08);
    this.nodes.filter.frequency.setTargetAtTime(Math.max(120, filterTarget), now, 0.09);
    this.nodes.highpass.frequency.setTargetAtTime(42 + params.ghostTension * 42 + params.rotWallDecay * 28, now, 0.12);
    this.nodes.noiseGain.gain.setTargetAtTime(staticAmount, now, 0.04);
    this.nodes.portalBass.frequency.setTargetAtTime(146 + params.portalPull * 70 + params.elevatorHeight * 28, now, 0.08);
    this.nodes.portalGain.gain.setTargetAtTime(portalAmount, now, 0.06);
    this.nodes.master.gain.setTargetAtTime(0.012 + params.audioIntensity * 0.018, now, 0.12);
  }

  blip(kind = "portal") {
    if (!this.nodes) {
      return;
    }

    const oscillator = this.nodes.context.createOscillator();
    const gain = this.nodes.context.createGain();
    oscillator.type = kind === "ghost" ? "sine" : "triangle";
    oscillator.frequency.value = kind === "ghost" ? 392 : kind === "error" ? 740 : kind === "chain" ? 294 : 587.33;
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(this.nodes.master);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.032, this.nodes.context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.nodes.context.currentTime + 0.42);
    oscillator.stop(this.nodes.context.currentTime + 0.45);
  }
}

export const audioMoodEngine = new AudioMoodEngine();
