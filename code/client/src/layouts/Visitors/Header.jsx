import { AuthContext } from '../../contexts/authContext'
import { useState, useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button, Navbar } from "react-bootstrap"
import { RiMenu3Fill } from 'react-icons/ri'
import { toast } from 'react-toastify'

import logoWhite from '@assets/logo/logo-white.png'
import logo from '@assets/logo/logo-no-background.png'
import api from '@services/api'

import navigation from "@data/navigation"
import { NavLink } from "@components/ui-core"

import MobileSidebar from "./MobileSidebar"

const Header = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false)

    const [{role, loggedIn}, updateAuth] = useContext(AuthContext)
    const closeSidebar = () => setOpen(false)
    const openSidebar = () => setOpen(true)
    const navigate = useNavigate()

    const handleLogout = () => {
        api.users.logout()
            .then(async () => {
                await updateAuth()
                navigate('/')
            })
            .catch(() => toast.error("There has been an error, try again later", { theme: 'colored' }))
    };

    return (
        <Navbar bg={location.pathname !== "/" ? "light" : ""} className="px-4 px-lg-5 py-4 sticky-top flex justify-content-between align-items-center" style={{ zIndex: 99 }}>
            <MobileSidebar isOpen={open} close={closeSidebar} isLoggedIn={loggedIn} handleLogout={handleLogout}/>
            <Navbar.Brand style={{ width: "auto", height: 90 }}>
                <Link to="/">
                    <img src={location.pathname !== "/" ? logo : logoWhite} alt="logo" className="h-100" />
                </Link>
            </Navbar.Brand>
            <div className="fw-semibold">

                {/* Sidebar button for mobile devices */}
                <Button data-testid="mobile-sidebar-toggle" className="d-lg-none" variant={location.pathname !== "/" ? "base-light" : "base"} onClick={openSidebar}>
                    <RiMenu3Fill />
                </Button>

                {/* Navigation for desktop devices */}
                <AuthContext.Consumer>
                    {([{ role, loggedIn }]) => (
                        <div className="d-none d-lg-flex align-items-center">
                            {
                                navigation.desktop
                                    .filter((link) => link.users.includes(role) || link.users.includes("All")) // Show links depending on user role
                                    .map((link, idx) => (
                                        <NavLink key={idx} url={link.url} variant={link.variant} className={`${location.pathname !== "/" ? "text-primary-dark" : "text-primary-light"} ps-5`}>
                                            {link.label}
                                        </NavLink>
                                    ))
                            }
                            {
                                loggedIn &&
                                <Button variant="danger-light" className="fw-bold px-4" onClick={handleLogout}>
                                    Logout
                                </Button>
                            }
                        </div>
                    )}
                </AuthContext.Consumer>
            </div>
        </Navbar>
    )
}

export default Header