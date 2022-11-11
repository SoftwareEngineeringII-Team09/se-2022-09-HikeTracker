import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"

const NavLink = ({ url, linkStyle = "link", className, children }) => {
    return (
        <Link to={url} className={`text-decoration-none ${className}`}>
            {linkStyle === "link" ?
                children :
                <Button variant="primary-light" className="fw-bold px-4">
                    {children}
                </Button>
            }
        </Link>
    )
}

export default NavLink