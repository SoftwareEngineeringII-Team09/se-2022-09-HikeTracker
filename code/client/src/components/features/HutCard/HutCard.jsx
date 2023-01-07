import { Link } from "react-router-dom"
import { Col, Button, Image } from "react-bootstrap"
import { getLocationRegion, getLocationFullName } from '@lib/helpers/location'

import { SERVER_PORT } from '@services/config'

const HutCard = ({ hut }) => {
    return (
        <Col xs={12} lg={6} xl={4}>
            <div className='bg-base-light p-4 h-100 rounded-3 d-flex flex-column justify-content-between'>
                <Image fluid src={`http://localhost:${SERVER_PORT}/${hut.hutImage}`} alt="Hut cover" className="rounded-3 mb-3" style={{ objectFit: 'cover' }} />
                <div className='mb-3'>
                    <h3 className='fw-bold'>{hut.hutName}</h3>
                </div>

                {hut.city && <dl className='d-flex flex-column mt-4 justify-content-between'>
                    <div className='d-flex flex-column'>
                        <dt>Location</dt>
                        <dd className='m-0'>{getLocationFullName(hut.province, hut.city) + ', ' + getLocationRegion(hut.region)}</dd>
                    </div>
                    <div className='d-flex flex-column my-3'>
                        <dt>Altitude</dt>
                        <dd className='m-0'>{hut.altitude.toFixed(2)} m</dd>
                    </div>
                    <div className='d-flex flex-column'>
                        <dt>Cost per night</dt>
                        <dd className='m-0'>{hut.cost} €</dd>
                    </div>
                    <div className='d-flex flex-column mt-3'>
                        <dt>Number of beds</dt>
                        <dd className='m-0'>{hut.numOfBeds}</dd>
                    </div>
                </dl>}
                <Link to={`/huts/${hut.hutId}`} className="text-decoration-none w-100" style={{ color: "currentcolor" }}>
                    <Button variant="primary-dark" className="fw-bold mt-4 w-100">
                        See more details
                    </Button>
                </Link>
            </div>
        </Col>
    )
}

export default HutCard