import React, { useContext, useEffect, useRef, useState } from 'react'
import { Authcontext } from '../context/Authcontext';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config';
import { Groupcontext } from '../context/Groupcontext';

const Message = ({message}) => {
  const { curUser } = useContext(Authcontext);
  const { curGroup } = useContext(Groupcontext)
  const ref = useRef();
  
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  }, [message])

  const handleunsend = () => {
    if (curUser.uid != message.senderId) {
      return;
    }
    let check = confirm("Are you sure to delete this message?");
    if (check) {
      if (message.img) {
        updateDoc(doc(db, "groups_message", curGroup.groupId), {
          messages:arrayRemove({
            id:message.id,
            text:message.text,
            sendername:message.sendername,
            senderId:message.senderId,
            photoURL:message.photoURL,
            img:message.img
          })
        })
      } else {
        updateDoc(doc(db, "groups_message", curGroup.groupId), {
          messages:arrayRemove({
            id:message.id,
            text:message.text,
            sendername:message.sendername,
            senderId:message.senderId,
            photoURL:message.photoURL,
          })
        })
      }
    }else {
      return
    }
  }

  return (
    <div ref={ref} className={`message-${message.senderId === curUser.uid && "owner"}`}>
      <div className='message-info'>
        <img className='message-info-img' src={message.photoURL}></img>
        <span className='message-info-name'>{message.sendername}</span>
      </div>
      <div className='message-content' onClick={handleunsend}>
        {message.text && <div className='message-content-text'>{message.text}</div>}
        {message.img && <img className='message-content-img' src={message.img}></img>}
      </div>
    </div>
    
  )
}

export default Message;