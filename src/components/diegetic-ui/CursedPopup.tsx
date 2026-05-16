type CursedPopupProps = {
  title?: string;
  children: React.ReactNode;
  tone?: "red" | "blue" | "violet";
  onClick?: () => void;
};

export default function CursedPopup({ title = "SOFT WINDOW", children, tone = "violet", onClick }: CursedPopupProps) {
  return (
    <button className={`cursed-popup cursed-popup--${tone}`} onClick={onClick} type="button">
      <span className="cursed-popup__bar">
        <i />
        {title}
        <em>x</em>
      </span>
      <span className="cursed-popup__body">{children}</span>
    </button>
  );
}
