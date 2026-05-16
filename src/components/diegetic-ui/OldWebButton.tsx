type OldWebButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
};

export default function OldWebButton({ children, onClick, title }: OldWebButtonProps) {
  return (
    <button className="old-web-button" onClick={onClick} type="button" title={title}>
      {children}
    </button>
  );
}
