import React, { useContext } from "react";
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc} from "firebase/firestore";
import { db } from "../../config";
import { Authcontext } from '../context/Authcontext';
import { Groupcontext } from "../context/Groupcontext";

const Functionbar = ()=>{

    const navigate = useNavigate();
    const {curUser} = useContext(Authcontext);
    const {dispatch} = useContext(Groupcontext);

    const addgroup = async () => {
        const date = new Date().getTime();
        const groupname = prompt('Please enter the group name');
        const combinename = groupname + "-" + date;
        if (!groupname) {
            console.log("dont't get group name")
            return
        } else {
            try{
                await setDoc(doc(db, "groups_info", combinename), {
                    groupname:groupname, 
                    member:arrayUnion(curUser.uid)
                });
                await setDoc(doc(db, "groups_message", combinename),{
                    messages:[]
                })
                await updateDoc(doc(db, "userchat", curUser.uid), {
                    [combinename+".groupname"]:groupname,
                    [combinename+".date"]:serverTimestamp(),
                })
                console.log("group creat successful")
            } catch(error){
                console.log(error);
            }
        }
    }

    const signout = () => {
      let auth = getAuth();
      try{
        signOut(auth);
        dispatch({type:"LOGINOUT", payload:null})
        navigate("/");
      }catch(error){
        console.log(error);
      }
    }
    return(
        <div className="functionbar">
            <button className='functionbar-logoutBtn' onClick={signout}></button>
            <button className="functionbar-addgroupBtn" onClick={addgroup}></button>
        </div>
    )
}

export default Functionbar;