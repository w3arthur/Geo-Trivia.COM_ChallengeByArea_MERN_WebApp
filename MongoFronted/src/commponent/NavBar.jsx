import React from 'react'
import { Link } from "react-router-dom"
import "./NavBar.css";
function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <h1><Link className='link' to="/" >HOME</Link></h1>
      <h1><Link className='link' to="/note">note</Link></h1>
      <h1><Link className='link' to="/create">createnote</Link></h1>
    </nav>
  )
}

export default NavBar