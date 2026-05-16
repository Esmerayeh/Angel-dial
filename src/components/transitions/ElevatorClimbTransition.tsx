export default function ElevatorClimbTransition() {
  return (
    <div className="transition transition--elevator-climb" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}
