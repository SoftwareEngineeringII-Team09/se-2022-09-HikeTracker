import { Container, Row, Col } from 'react-bootstrap';

const HikeEndpoint = ({ type, point }) => {

    return (
        <>
            <h3>{type} point <img alt={`${type} point pin`} href="" /></h3>
            {point && point.name && <p>{point.name}</p>}
            <Container fluid>
                <Row>
                    <Col xs={4}>
                        Latitude: {point && point.coords[0]}
                    </Col>
                    <Col xs={4}>
                        Longitude: {point && point.coords[1]}
                    </Col>
                </Row>
            </Container>
        </>
    );

};

export default HikeEndpoint;