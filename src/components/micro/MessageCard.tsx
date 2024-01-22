import { useEffect, useRef } from "react";
import { Message } from "../../global";

type MessageCarddProps = {
  msg: Message;
};

export default function MessageCard({ msg }: MessageCarddProps): JSX.Element {
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
