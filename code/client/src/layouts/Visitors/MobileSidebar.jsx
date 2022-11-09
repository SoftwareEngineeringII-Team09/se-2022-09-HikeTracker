import { Link } from "react-router-dom";
import { Offcanvas, Alert } from "react-bootstrap";

import { RiCloseLine } from 'react-icons/ri'

import { navigation } from "../../data";
import { NavLink } from "../../components/ui-core";

const MobileSidebar = ({ open, setOpen }) => {
    return (
        <Offcanvas show={open} onHide={() => setOpen(false)} placement="end" className="bg-light">
            <Offcanvas.Header className="px-4">
                <Offcanvas.Title className="text-base-dark fs-4">Menu</Offcanvas.Title>
                <RiCloseLine style={{ width: 32, height: 32 }} onClick={() => setOpen(false)} />
            </Offcanvas.Header>
            <Offcanvas.Body className="my-5 px-4">
                <div className="d-flex flex-column align-items-start">
                    {navigation.mobile.map((link, idx) => (
                        <NavLink key={idx} url={link.url} className="fs-5 text-primary-dark pt-3">
                            {link.label}
                        </NavLink>
                    ))}
                    <Alert variant="primary" className="w-100 mt-5">
                        <Alert.Heading className="fw-bold text-primary-dark">No account yet?</Alert.Heading>
                        What are you waiting for? It's so easy... {" "}
                        <Link to="/signup" className="fw-bold text-primary-dark">
                            Create an account now
                        </Link>
                    </Alert>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default MobileSidebar