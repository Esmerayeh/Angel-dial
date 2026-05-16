type ForumPanelProps = {
  channel: string;
  messages: string[];
};

export default function ForumPanel({ channel, messages }: ForumPanelProps) {
  return (
    <div className="forum-panel">
      <strong>{channel}</strong>
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}
