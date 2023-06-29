import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { auth } from '../../config';
import { Authcontext } from './Authcontext';

export const Groupcontext = createContext()

export const GroupcontextProvider = ({children})=>{
    const {curUser} = useContext(Authcontext);

    const INITIAL = {
        groupId: null,
        groupname: null
    }

    const groupReducer = (state, action) => {
        switch(action.type) {
            case "CHANGE_GROUP":
                return{
                    groupId:action.payload[0],
                    groupname:action.payload[1].groupname
                }
            case "LOGINOUT":
                return {
                    groupId: null,
                    groupname: null
                }
            default :
                return state
        }
    }

    const [state, dispatch] = useReducer(groupReducer, INITIAL);
    return(
        <Groupcontext.Provider value={{curGroup:state, dispatch}}>
            {children}
        </Groupcontext.Provider>
    );
}