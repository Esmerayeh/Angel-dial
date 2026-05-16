type CircularOSWindowProps = {
  title: string;
  children: React.ReactNode;
};

export default function CircularOSWindow({ title, children }: CircularOSWindowProps) {
  return (
    <div className="circular-os-window">
      <span className="circular-os-window__title">{title}</span>
      <div>{children}</div>
    </div>
  );
}
