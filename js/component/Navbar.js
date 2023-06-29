import React, { useContext } from 'react'
import { Authcontext } from '../context/Authcontext';

const Navbar = () => {
  const {curUser} = useContext(Authcontext);
  
  return (
    <div className='navbar'>
      <span className='navbar-title'>Zack's Chat</span>
      <div className='navbar-info'>
        <img className='navbar-img' src={curUser.photoURL}></img>
        <span className='navbar-username'>{curUser.displayName}</span>
      </div>
    </div>
  )
}

export default Navbar;