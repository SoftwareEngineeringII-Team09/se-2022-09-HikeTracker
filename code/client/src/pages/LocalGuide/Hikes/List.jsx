import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { TbFilePlus } from 'react-icons/tb'
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa'

import { Tooltip } from '@components/ui-core';

const Hike = () => (
    <div className='d-flex align-items-center justify-content-between'>
        <h5 className='fw-bold m-0'>Escursione</h5>
        <div>
            <Tooltip tip="Update reference points">
                <Link to="/account/reference-points/1">
                    <span className='text-primary-dark fw-bold mx-2'>
                        <FaMapMarkerAlt size={20} />
                    </span>
                </Link>
            </Tooltip>
            <Tooltip tip="See more details">
                <Link to="/account/reference-points/1">
                    <span className='text-primary-dark fw-bold mx-2'>
                        <FaInfoCircle size={20} />
                    </span>
                </Link>
            </Tooltip>
        </div>
    </div>
)

const ListHikes = () => {
    return (
        <div className='my-5'>
            <div className='mb-5'>
                <h1 className="fw-bold">My hikes</h1>
                <p>Explore and manage your hikes! Here you can create a new hike and you can update reference points for each of them.</p>
            </div>
            <Link to="/account/hikes/add">
                <Button variant='primary-light' className='fw-bold' size='lg'>
                    <TbFilePlus size={30} className="me-2" />
                    Create new hike
                </Button>
            </Link>
            <Row className='my-5 gy-3'>
                <Col xs={12} className='bg-base-light py-3 px-5 rounded-3'>
                    <Hike />
                </Col>
            </Row>
        </div >
    );
}

export default ListHikes;