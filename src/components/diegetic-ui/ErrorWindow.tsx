type ErrorWindowProps = {
  message: string;
  onClick?: () => void;
};

export default function ErrorWindow({ message, onClick }: ErrorWindowProps) {
  return (
    <button className="error-window" type="button" onClick={onClick}>
      <b>ERROR</b>
      <span>{message}</span>
      <em>OK / CANCEL / MAYBE</em>
    </button>
  );
}
