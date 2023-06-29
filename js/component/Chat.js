import React, { useContext, useEffect, useRef, useState } from 'react'
import Message from './Message'
import { Groupcontext } from '../context/Groupcontext'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config';
import { Authcontext } from '../context/Authcontext';


const Chat = () => {
  const {curUser} = useContext(Authcontext);
  const {curGroup} = useContext(Groupcontext);
  const [messages, setMessages] = useState([]);
  const messagesLen = useRef(0);
  const notification = useRef(false);

  useEffect(()=>{
    const getMessages = () =>{
      const unsub = onSnapshot(doc(db, "groups_message", curGroup.groupId),(doc)=>{
          if (!notification.current) {
            messagesLen.current = doc.data().messages.length;
          }
          notification.current = true;
          setMessages(doc.data().messages)
      })
      
      return ()=>{
          unsub();
      }
    }
    curGroup.groupId && getMessages();
  }, [])

  useEffect(()=>{
    const notificationTitle = "New message"
    const spawnNotification = (thebody) => {
      console.log("create notification")
      if (Notification.permission === "granted") {
        let notificationOption = {
          body:thebody, 
          timeout: 2000
        }
        let notification = new Notification(notificationTitle, notificationOption)
      } else {
        console.log("deny");
      }
    }
    const adjustmessagesLen = () => {

      if(notification.current) {
        console.log(messagesLen.current)
        console.log(messages.length)
        console.log("notification!!!")
        if(messages.length > messagesLen.current){
          const lastmessage = messages.slice(-1)[0];
          if (lastmessage.senderId != curUser.uid) {
            spawnNotification(lastmessage.text)
          }
        }
        messagesLen.current = messages.length;
      }
      
    }
    curGroup.groupId && adjustmessagesLen();
    

  }, [messages])

  return (
    <div className='chat'>
      {messages?.map(m => (
        <Message message = {m} key={m.id}/>
      ))}
    </div>
  )
}

export default Chat;