export default function OrreryShiftTransition() {
  return (
    <div className="transition transition--orrery-shift" aria-hidden="true">
      {["CD", "PEARL", "ARCADE", "GHOST", "HALO", "TAB", "BOTTLE", "WING"].map((label, index) => (
        <span key={label} style={{ "--i": index } as React.CSSProperties}>
          {label}
        </span>
      ))}
    </div>
  );
}
