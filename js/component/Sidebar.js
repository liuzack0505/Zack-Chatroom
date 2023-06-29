import React from 'react'
import Navbar from "./Navbar"
import Searchbar from "./Searchbar"
import Functionbar from "./functionbar"
import Groupbar from './Groupbar'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Searchbar />
      <Groupbar />
      <Functionbar />
    </div>
  )
}

export default Sidebar;