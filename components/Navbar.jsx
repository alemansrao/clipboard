import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, Divider, NavbarItem, Link, Button } from "@heroui/react"
import { FaClipboard, FaPlusCircle } from "react-icons/fa"
import { ThemeSwitch } from "@/components/theme-switch"
import { useSession } from "next-auth/react"

const NavbarComponent = () => {
  const { status } = useSession();
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
          {/* Show logout only if authenticated */}
          {status === "authenticated" && (
            <NavbarItem className="justify-center items-center flex gap-3">
              <Link href='/logout'>
                <Button color="white" variant="ghost" className="border-2 rounded-none border-gray-300 text-primary-900">
                  Logout
                </Button>
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
      <Divider />
      <div className="py-2">
      </div>
    </>
  )
}

export default NavbarComponent