import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Message, Prettify } from "../../global";

type TMessagesContext = {
  msgs: Message[];
  addMessage: (msg: Message) => void;
  removeMessage: (msg: Message) => void;
};

const MessagesContext = createContext<Prettify<TMessagesContext>>({
  msgs: [],
  addMessage: () => {},
  removeMessage: () => {},
});

export function useMessages() {
  return useContext(MessagesContext);
}

export default function MessagesProvider({ children }: PropsWithChildren) {
  const [msgs, setMsgs] = useState<Message[]>([]);

  function addMessage(msg: Message, callBack?: () => void) {
    setMsgs(prevMsgs => {
      const msgs = [...prevMsgs, msg];
      return msgs.toSorted((a, b) => a.type.localeCompare(b.type));
    });
    setTimeout(() => {
      removeMessage(msg);
      if (callBack) callBack();
    }, 5000);
  }

  function removeMessage(msg: Message) {
    setMsgs(prevMsgs => {
      const indexToRemove = prevMsgs.findIndex(prevMsgItem => prevMsgItem.text === msg.text && prevMsgItem.type === msg.type);
      return prevMsgs.filter((_, index) => index !== indexToRemove);
    });
  }

  const contextContent = {
    msgs,
    addMessage,
    removeMessage,
  };

  return <MessagesContext.Provider value={contextContent}>{children}</MessagesContext.Provider>;
}
