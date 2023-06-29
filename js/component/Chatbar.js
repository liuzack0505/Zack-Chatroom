import React, { useContext } from 'react'
import Chat from "../component/Chat"
import Input from "../component/Input"
import { Groupcontext } from '../context/Groupcontext'

const Chatbar = () => {

  const{curGroup} = useContext(Groupcontext);
  return (
    <div className='chatbar'>
      <div className='chattopbar'>
          <span className='username'>{curGroup.groupname}</span>
      </div>
      <Chat />
      <Input />
    </div>
  )
}

export default Chatbar;