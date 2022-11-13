import { Outlet } from "react-router";
import { Container, Row } from "react-bootstrap";

import Header from "./Header";

const Layout = () => {
    return (
        <Container fluid className="h-100 p-0 overflow-x-hidden d-flex flex-column justify-content-between">
            <Header />
            <Container className="d-flex flex-fill align-items-center justify-content-center">
                <Row>
                    <Outlet />
                </Row>
            </Container>
        </Container>
    );
}

export default Layout;