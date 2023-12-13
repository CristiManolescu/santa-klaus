interface ChatMessageProps {
  //name: string;
  message: string;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex items-center shadow-sm p-2">
      <span className="m-2">{message}</span>
    </div>
  );
}
