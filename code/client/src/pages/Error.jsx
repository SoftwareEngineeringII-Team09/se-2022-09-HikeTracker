import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const Default = () => {
    return (
        <Container fluid className="d-flex flex-fill justify-content-center h-100">
            <div className="d-flex align-items-center flex-column justify-content-center text-base-dark">
                <h1 className="fw-bold">Page not found</h1>
                <p className="mb-5">This page does not exist...</p>
                <Link to={"/"}>
                    <Button variant="primary-light" size="lg" className="fw-bold">
                        Go to the homepage
                    </Button>
                </Link>
            </div>
        </Container>
    );
}

export default Default;