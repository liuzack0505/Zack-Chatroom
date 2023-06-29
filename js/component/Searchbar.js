import React, { useContext } from 'react'
import { useState } from 'react';
import { collection, query, where, getDoc, doc, setDoc, updateDoc, serverTimestamp, getDocs, arrayUnion } from "firebase/firestore";
import { db } from "../../config";
import { Authcontext } from '../context/Authcontext';
import { Groupcontext } from '../context/Groupcontext';

const Searchbar = () => {
  const [searchuseremail, Setsearchuseremail] = useState("");
  const [error, Seterror] = useState(false);
  const [user, Setuser] = useState(null);

  const {curUser} = useContext(Authcontext);
  const {curGroup}  =useContext(Groupcontext);

  const handleselect = async () => {
    if (!curGroup.groupId) {
      alert("Please choose a chatroom!")
      return;
    }
    try{
      await updateDoc(doc(db, "groups_info", curGroup.groupId), {
        member:arrayUnion(user.uid)
      })
      await updateDoc(doc(db, "userchat", user.uid), {
        [curGroup.groupId+".groupname"]:curGroup.groupname,
        [curGroup.groupId+".date"]:serverTimestamp()
      })
    }catch(error){
      console.log(error);
    }
    console.log(user);
    alert("Add "+`${user.displayname}`+" to current chatroom!");
    Setuser(null);
    Setsearchuseremail("");
  }

  const search = async () => {
    try{
      const q = query(collection(db, "users"), where("email", "==", searchuseremail));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        Setuser(doc.data());
      });
    }catch(error){
      console.log(error);
      Seterror(true);
    }
  }

  const Keyboard = (e)=>{
    if(e.code === "Enter"){
      try{
        search();
      } catch(error){
        console.log(error);
      }
    }
  }

  return (
    <div className='searchbar' >
      <input type='text' className='searchbar-search' placeholder="Search user's email" value={searchuseremail} onKeyDown={Keyboard} onChange={(e) => Setsearchuseremail(e.target.value)}></input>
      <div className='searchbar-user'>
        {(error) && <span className='searchbar-user-span'>Can't find the user</span>}
        {user && 
          <div className='user' onClick={handleselect}>
            <img className='user-img' src={user.photoURL}></img>
            <span className='user-name'>{user.displayname}</span>
          </div>}
          <div className='groups'>
          </div>
      </div>
    </div>
  )
}

export default Searchbar;