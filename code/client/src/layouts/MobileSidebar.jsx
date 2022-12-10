import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Offcanvas, Alert, Button } from "react-bootstrap";
import { RiCloseLine } from 'react-icons/ri'
import { toast } from "react-toastify";

import { AuthContext } from "@contexts/authContext";

import navigation from "@data/navigation";
import { NavLink } from "@components/ui-core";
import api from "@services/api";

const MobileSidebar = ({ isOpen, close }) => {
    const [user, updateUser] = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        api.users.logout()
            .then(() => {
                close()
                updateUser(true)
                toast.success("That's all folks!", { theme: 'colored' })
                navigate('/', { replace: true })
            })
            .catch(err => toast.error(err, { theme: 'colored' }))
    }

    return (
        <Offcanvas show={isOpen} onHide={close} placement="end" className="bg-light">
            <Offcanvas.Header className="px-4 text-primary-dark">
                <Offcanvas.Title className="fs-4 fw-bold opacity-50">Menu</Offcanvas.Title>
                <RiCloseLine data-testid="close-button" size={32} onClick={close} />
            </Offcanvas.Header>
            <Offcanvas.Body className="mb-5 px-4 d-flex flex-column justify-content-between">
                <div className="d-flex flex-column align-items-start">
                    {<Alert variant="primary" className="w-100 my-5">
                        <Alert.Heading className="fw-bold text-primary-dark">
                            {!user.loggedIn ? "No account yet?" : `Hi, ${user.firstname || "Hiker"}`}
                        </Alert.Heading>
                        {!user.loggedIn ? "What are you waiting for? It's so easy... " : user.email}

                        {!user.loggedIn && <Link to={"/signup"} className="fw-bold text-primary-dark d-block mt-3">
                            Create an account now
                        </Link>}
                    </Alert>}
                    {navigation(user.loggedIn ? user.role.replace(" ", "") : "Visitor").map((link, idx) => (
                        <NavLink key={idx} url={link.url} className="fs-5 text-primary-dark pt-3 fw-bold">
                            {link.label}
                        </NavLink>
                    ))}
                </div>
                {user.loggedIn &&
                    <Button variant="primary-dark" size="lg" className="d-block py-3 fw-bold w-100" onClick={handleLogout}>
                        Logout
                    </Button>
                }
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default MobileSidebar