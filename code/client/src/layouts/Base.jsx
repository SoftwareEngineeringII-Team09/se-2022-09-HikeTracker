import { Outlet } from "react-router";
import { Container, Row } from "react-bootstrap";

const Layout = () => {
    return (
        <Container fluid className="h-100 p-0 overflow-hidden d-flex flex-column justify-content-between">
            <Container className="d-flex flex-fill align-items-center justify-content-center">
                <Row>
                    <Outlet />
                </Row>
            </Container>
        </Container>
    );
}

export default Layout;