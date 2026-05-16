export default function ClockBloomTransition() {
  return (
    <div className="transition transition--clock-bloom" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}
