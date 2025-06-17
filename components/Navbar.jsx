import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, Divider, NavbarItem, Link } from "@heroui/react"
import { FaClipboard, FaPlusCircle } from "react-icons/fa"
import { ThemeSwitch } from "@/components/theme-switch"
const NavbarComponent = () => {
  return (
    <>
      <Navbar>
        <NavbarBrand>
          <FaClipboard className="pr-2" size={24} />
          <Link href="/" className="font-bold text-inherit">Clipboard</Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="flex">
            <Link href="/add"> <FaPlusCircle size={24} /> </Link>
          </NavbarItem>
          <NavbarItem className="justify-center items-center flex gap-3">
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Divider />
      <div className="py-2">
      </div>
    </>
  )
}

export default NavbarComponent