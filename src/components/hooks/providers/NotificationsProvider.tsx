import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Notification } from "../../../global";

export type NotificationsContext = {
  msgs: Notification[];
  addNotification: (msg: Notification) => void;
  removeNotification: (msg: Notification) => void;
};

const NotificationsContext = createContext<NotificationsContext | undefined>(undefined);

export function useNotifications() {
  return useContext(NotificationsContext);
}

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [msgs, setMsgs] = useState<Notification[]>([]);

  function addNotification(msg: Notification, callBack?: () => void) {
    setMsgs(prevMsgs => {
      const msgs = [...prevMsgs, msg];
      return msgs.toSorted((a, b) => a.type.localeCompare(b.type));
    });
    setTimeout(() => {
      removeNotification(msg);
      if (callBack) callBack();
    }, 5000);
  }

  function removeNotification(msg: Notification) {
    setMsgs(prevMsgs => {
      const indexToRemove = prevMsgs.findIndex(
        prevMsgItem => prevMsgItem.text === msg.text && prevMsgItem.type === msg.type
      );
      return prevMsgs.filter((_, index) => index !== indexToRemove);
    });
  }

  const contextContent = {
    msgs,
    addNotification,
    removeNotification,
  };

  return <NotificationsContext.Provider value={contextContent}>{children}</NotificationsContext.Provider>;
}
