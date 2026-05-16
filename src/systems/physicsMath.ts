export type Point = {
  x: number;
  y: number;
};

export type SpringResult = {
  value: number;
  velocity: number;
};

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * clamp(amount);
}

export function springTo(current: number, target: number, velocity: number, stiffness = 0.14, damping = 0.78, deltaTime = 1 / 60): SpringResult {
  const frameScale = deltaTime * 60;
  const force = (target - current) * stiffness;
  const nextVelocity = (velocity + force * frameScale) * damping;
  return {
    value: current + nextVelocity * frameScale,
    velocity: nextVelocity,
  };
}

export function angleFromPointer(point: Point, rect: DOMRect | { left: number; top: number; width: number; height: number }) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return normalizeAngle(Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI) + 90);
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function shortestAngleDelta(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

export function snapAngle(angle: number, snapPoints: number[]) {
  return snapPoints.reduce((closest, snapPoint) => {
    const currentDistance = Math.abs(shortestAngleDelta(angle, closest));
    const nextDistance = Math.abs(shortestAngleDelta(angle, snapPoint));
    return nextDistance < currentDistance ? snapPoint : closest;
  }, snapPoints[0] ?? angle);
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function inverseSquareAttraction(source: Point, target: Point, strength = 1, minDistance = 36, maxDistance = 620) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const rawDistance = Math.hypot(dx, dy);
  const safeDistance = clamp(rawDistance, minDistance, maxDistance);
  const force = strength / (safeDistance * safeDistance);
  const normalizedForce = clamp(force * minDistance * minDistance);

  return {
    x: rawDistance === 0 ? 0 : (dx / rawDistance) * normalizedForce,
    y: rawDistance === 0 ? 0 : (dy / rawDistance) * normalizedForce,
    force: normalizedForce,
    distance: rawDistance,
  };
}

export function dampedVelocity(velocity: number, damping = 0.88, deltaTime = 1 / 60) {
  return velocity * Math.pow(damping, deltaTime * 60);
}

export function mapRange(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number) {
  if (inputMax === inputMin) {
    return outputMin;
  }

  const normalized = clamp((value - inputMin) / (inputMax - inputMin));
  return lerp(outputMin, outputMax, normalized);
}
