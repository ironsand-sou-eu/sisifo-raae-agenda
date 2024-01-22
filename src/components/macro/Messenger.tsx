import { useMessages } from "../hooks/MessagesProvider";
import MessageCard from "../micro/MessageCard";

export default function Messenger(): JSX.Element {
  const { msgs } = useMessages();
  return (
    <ul className="messages">
      {msgs.map((msg, index) => (
        <MessageCard key={index} msg={msg} />
      ))}
    </ul>
  );
}
