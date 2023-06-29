import React, { useContext, useRef, useState } from 'react'
import LinkImg from '../../img/link.png'
import SendImg from '../../img/send.png'
import { Authcontext } from '../context/Authcontext'
import { Groupcontext } from '../context/Groupcontext'
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../config'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {

  const {curUser} = useContext(Authcontext)
  const {curGroup} = useContext(Groupcontext)

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const inputRef = useRef(null);

  const handleSend = async ()=>{

    if (!img && !text) {
      return;
    }
    if (curGroup.groupId === null) {
      setText("");
      setImg(null);
      return;
    }
    if(img){
      const storageRef = ref(storage, uuid())

      try{
        await uploadBytesResumable(storageRef, img);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "groups_message", curGroup.groupId),{
          messages:arrayUnion({
            id:uuid(),
            text:text,
            sendername:curUser.displayName,
            senderId:curUser.uid,
            photoURL:curUser.photoURL,
            img:downloadURL
          })
        })
      }catch(error){
        console.log(error);
      }

    } else {
      try{
        await updateDoc(doc(db, "groups_message", curGroup.groupId),{
          messages:arrayUnion({
            id:uuid(),
            text,
            sendername:curUser.displayName,
            senderId:curUser.uid,
            photoURL:curUser.photoURL,
          })
      })
      } catch (error){
        console.log(error);
      }
      
    }
    setText("");
    setImg(null);
  }

  const Keyboard = (e)=>{
    if(e.code === "Enter"){
      try{
        {(text || img) && handleSend()}
      } catch(error){
        console.log(error);
      }
    }
  }

  return (
    <div className='input'>
      <input type='text' className='input-text' placeholder='Send message' onChange={(e)=>setText(e.target.value)} onKeyDown={Keyboard} value={text}></input>
      <input type='file' style={{display:"none"}} ref={inputRef} onChange={(e)=>setImg(e.target.files[0])} />
      <button className='input-linkBtn' onClick={() => inputRef.current.click()}><img src={LinkImg} className='input-linkBtn-img'></img></button>
      <button className='input-sendBtn' onClick={handleSend}><img src={SendImg} className='input-sendBtn-img'></img></button>
    </div>
  )
}

export default Input;