import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button, Navbar } from "react-bootstrap"
import { RiMenu3Fill } from 'react-icons/ri'

import logoWhite from '../../assets/logo/logo-white.png'
import logo from '../../assets/logo/logo-no-background.png'

import { navigation } from "../../data"
import { NavLink } from "../../components/ui-core"

import MobileSidebar from "./MobileSidebar"

const Header = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false)

    return (
        <Navbar bg={location.pathname !== "/" ? "light" : ""} className="px-4 px-lg-5 py-4 sticky-top flex justify-content-between align-items-center" style={{ zIndex: 99 }}>
            <MobileSidebar open={open} setOpen={setOpen} />
            <Navbar.Brand className="" style={{ width: "auto", height: 90 }}>
                <Link to="/">
                    <img src={location.pathname !== "/" ? logo : logoWhite} alt="logo" className="h-100" />
                </Link>
            </Navbar.Brand>
            <div className="fw-semibold">

                {/* Sidebar button for mobile devices */}
                <Button className="d-lg-none" variant={location.pathname !== "/" ? "base-light" : "base"} onClick={() => setOpen(true)}>
                    <RiMenu3Fill />
                </Button>

                {/* Navigation for desktop devices */}
                <div className="d-none d-lg-flex align-items-center">
                    {navigation.desktop.map((link, idx) => (
                        <NavLink key={idx} url={link.url} linkStyle={link.style} className={`${location.pathname !== "/" ? "text-primary-dark" : "text-primary-light"} ps-5`}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </Navbar>
    )
}

export default Header