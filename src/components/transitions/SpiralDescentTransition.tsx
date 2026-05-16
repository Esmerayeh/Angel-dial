export default function SpiralDescentTransition() {
  return (
    <div className="transition transition--spiral-descent" aria-hidden="true">
      {Array.from({ length: 14 }, (_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}
