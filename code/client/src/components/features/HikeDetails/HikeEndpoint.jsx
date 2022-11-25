import { Container, Row, Col } from 'react-bootstrap';
import startPin from '@assets/pins/start-pin.png';
import endPin from '@assets/pins/end-pin.png';

const HikeEndpoint = ({ type, point }) => {

    const pinImage = type === 'start' ? startPin : endPin;

    return (
        <>
            <h3>{type} point <img alt={`${type} point pin`} src={pinImage} /></h3>
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