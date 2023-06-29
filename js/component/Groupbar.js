import React, { useContext, useEffect, useState } from 'react'
import { Authcontext } from '../context/Authcontext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config';
import { Groupcontext } from '../context/Groupcontext';

const Groupbar = () => {
    const {curUser} = useContext(Authcontext);
    const {dispatch} = useContext(Groupcontext);
    
    const [usergroup, setUsergroup] = useState([]);

    useEffect(()=>{

        const getGroups = () =>{
            const unsub = onSnapshot(doc(db, "userchat", curUser.uid),(doc)=>{
                setUsergroup(doc.data())
            })

            return ()=>{
                unsub();
            }
        }
        curUser.uid && getGroups();

    }, [curUser.uid])

    const handleselect = (groupinfo) => {
        dispatch({type:"CHANGE_GROUP", payload:groupinfo})
    }

    return (
        <div className='groupbar'>
            {Object.entries(usergroup)?.map(group => (
                <div className='group' key={group[0]} onClick={() => handleselect(group)}>
                    <span className='group-name'>{group[1].groupname}</span>
                </div>
            ))}
        </div>
    )
}

export default Groupbar;