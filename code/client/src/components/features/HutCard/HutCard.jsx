import { Link } from "react-router-dom"
import { Col, Button } from "react-bootstrap"
import { getLocationRegion, getLocationFullName } from '@lib/helpers/location'

const HutCard = ({ hut }) => {
    return (
        <Col xs={12} lg={6} xl={4}>
            <div className='bg-base-light p-4 h-100 rounded-3 d-flex flex-column justify-content-between'>
                <div className='mb-3'>
                    <h3 className='fw-bold'>{hut.hutName}</h3>
                </div>

                <dl className='d-flex mt-4 justify-content-between'>
                    <div className='d-flex flex-column'>
                        <dt>City, province, region</dt>
                        <dd className='m-0'>{getLocationFullName(hut.province, hut.city) + ', ' + getLocationRegion(hut.region)}</dd>
                    </div>
                    <div className='d-flex flex-column'>
                        <dt>Altitude</dt>
                        <dd className='m-0'>{hut.altitude.toFixed(2)} m</dd>
                    </div>
                    <div className='d-flex flex-column'>
                        <dt>Cost per night</dt>
                        <dd className='m-0'>{hut.cost} €</dd>
                    </div>
                    <div className='d-flex flex-column'>
                        <dt>Number of beds</dt>
                        <dd className='m-0'>{hut.numOfBeds}</dd>
                    </div>
                </dl>
                <Link to={`/search/${hut.hutId}`} className="text-decoration-none w-100" style={{ color: "currentcolor" }}>
                    <Button variant="primary-dark" className="fw-bold mt-4 w-100">
                        See more details
                    </Button>
                </Link>
            </div>
        </Col>
    )
}

export default HutCard