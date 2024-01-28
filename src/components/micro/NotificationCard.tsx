import { useEffect, useRef } from "react";
import { Notification } from "../../global";

type NotificationCardProps = {
  msg: Notification;
};

export default function NotificationCard({ msg }: NotificationCardProps): JSX.Element {
  const liRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    setTimeout(() => {
      liRef.current?.classList.add("fadeout");
    }, 2500);
  }, []);

  return (
    <li ref={liRef} className={`msg-${msg.type}`}>
      {msg.text}
      <span className="close-btn">+</span>
    </li>
  );
}
