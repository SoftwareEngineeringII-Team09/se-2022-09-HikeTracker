import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"

const NavLink = ({ url, variant = "link", className = "", children }) => {
    return (
        <Link to={url} className={`text-decoration-none ${className}`}>
            {variant === "button" ?
                <Button variant="primary-light" className="fw-bold px-4">
                    {children}
                </Button> :
                children
            }
        </Link>
    )
}

export default NavLink