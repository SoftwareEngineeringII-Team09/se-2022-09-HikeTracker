import { Container, Row, Col } from 'react-bootstrap';
import marker from '@assets/marker.png';

const HikeEndpoint = ({ type, point }) => {

    return (
        <>
            <h3>{type} point <img alt={`${type} marker`} className="custom-marker-icon" src={marker}/></h3>
            {point && point.name && <p>{point.name}</p>}
            <Container fluid>
                <Row className='mb-5'>
                    <Col xs={6} className="px-0">
                        Latitude: {point && point.coords[0]}
                    </Col>
                    <Col xs={6} className="px-0">
                        Longitude: {point && point.coords[1]}
                    </Col>
                </Row>
            </Container>
        </>
    );

};

export default HikeEndpoint;