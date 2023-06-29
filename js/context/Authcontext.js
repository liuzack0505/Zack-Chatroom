import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react'
import { auth } from '../../config';

export const Authcontext = createContext()

export const AuthcontextProvider = ({children})=>{
    const [curUser, SetcurUser] = useState({});

    useEffect(()=>{
        const changeAuth = onAuthStateChanged(auth, (user) => {
            SetcurUser(user);
            console.log(user);
        })
        return ()=>{
            changeAuth()
        };
    }, []);

    return(
        <Authcontext.Provider value={{curUser}}>
            {children}
        </Authcontext.Provider>
    );
}