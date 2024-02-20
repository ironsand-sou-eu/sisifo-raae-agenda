import { useNotifications } from "../../hooks/providers/NotificationsProvider";
import NotificationCard from "../../micro/NotificationCard";

export default function Messenger(): JSX.Element {
  const { msgs } = useNotifications();
  return (
    <ul className="notifications">
      {msgs.map((msg, index) => (
        <NotificationCard key={index} msg={msg} />
      ))}
    </ul>
  );
}
