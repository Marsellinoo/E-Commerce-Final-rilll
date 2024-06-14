import React from "react"
import "./Header.css"
import Search from "./Search"
import Navbar from "./Navbar"

const Header = ({ searchTerm, handleSearchInputChange, CartItem }) => {
  return (
    <>
      <Search CartItem={CartItem} searchTerm={searchTerm} handleSearchInputChange={handleSearchInputChange}/>
      <Navbar CartItem={CartItem}/>
    </>
  )
}

export default Header
