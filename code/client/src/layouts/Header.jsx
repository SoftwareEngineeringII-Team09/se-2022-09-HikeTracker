import { useState, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Navbar } from "react-bootstrap"
import { RiMenu3Fill } from 'react-icons/ri'

import logoWhite from '@assets/logo/logo-white.png'
import logo from '@assets/logo/logo-no-background.png'

import { AuthContext } from '@contexts/authContext'

import navigation from "@data/navigation"
import { NavLink } from "@components/ui-core"

import MobileSidebar from "./MobileSidebar"

const Header = () => {
    const [user] = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const location = useLocation();

    const closeSidebar = () => setOpen(false)
    const openSidebar = () => setOpen(true)

    return (
        <Navbar bg={location.pathname !== "/" ? "light" : ""} className="px-4 px-lg-5 py-4 sticky-top flex justify-content-between align-items-center" style={{ zIndex: 99 }}>
            <MobileSidebar isOpen={open} close={closeSidebar} />
            <Navbar.Brand style={{ width: "auto", height: 90 }}>
                <Link to="/">
                    <img src={location.pathname !== "/" ? logo : logoWhite} alt="logo" className="h-100" />
                </Link>
            </Navbar.Brand>
            <div className="fw-semibold">

                {/* Sidebar button for mobile devices */}
                <Button data-testid="mobile-sidebar-toggle" className={!user.loggedIn ? "d-lg-none" : "d-block"} variant={location.pathname !== "/" ? "base-light" : "base"} onClick={openSidebar}>
                    <RiMenu3Fill />
                </Button>

                {/* Navigation for desktop devices */}
                {!user.loggedIn && <div className="d-none d-lg-flex align-items-center">
                    {navigation("Visitor").map((link, idx) => (
                        <NavLink key={idx} url={link.url} variant={link.variant} className={`${location.pathname !== "/" ? "text-primary-dark" : "text-primary-light"} ps-5`}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>}
            </div>
        </Navbar>
    )
}

export default Header