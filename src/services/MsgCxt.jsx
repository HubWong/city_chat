import { createContext, useContext, useState, useEffect, useReducer } from "react"
import { Messages } from "@/shared/model/msgModel"

const MessagesContext = createContext(null)

export function MessagesProvider({ children }) {

  const [messages, setMessages] = useState(Messages.all());
  useEffect(() => {
    const unsubscribe = Messages.subscribe(() => {
      setMessages(Messages.all())
    })
    return unsubscribe
  }, [])

  const api = {
    add: Messages.add,
    get: Messages.get,
    roomMsgs: Messages.roomMsgs,
    all: () => messages,
    between: Messages.between,
    unreadFor: Messages.unreadFor,
    markRead: Messages.markRead,
    recall: Messages.recall
  }
  return (
    <MessagesContext.Provider value={api}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  return useContext(MessagesContext)
}
