type FakeBrowserWindowProps = {
  url: string;
  children: React.ReactNode;
};

export default function FakeBrowserWindow({ url, children }: FakeBrowserWindowProps) {
  return (
    <div className="fake-browser-window">
      <div className="fake-browser-window__chrome">
        <span />
        <span />
        <span />
        <em>{url}</em>
      </div>
      <div className="fake-browser-window__content">{children}</div>
    </div>
  );
}
