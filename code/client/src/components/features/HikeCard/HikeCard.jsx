import { Link } from "react-router-dom"
import { Col, Button } from "react-bootstrap"

const HikeCard = ({ hike }) => {
    return (
        <Col xs={12} lg={6} xl={4}>
            <div className='bg-base-light p-4 h-100 rounded-3 d-flex flex-column justify-content-between'>
                <div className='mb-3'>
                    <h3 className='fw-bold'>{hike.title}</h3>
                    <span>
                        Created by {hike.writer}
                        <span className='fw-bold bg-primary-light px-2 fs-6 py-1 ms-2 rounded-pill'>{hike.difficulty}</span>
                    </span>
                </div>
                <div className="overflow-hidden" style={{ height: 140 }}>
                    <p className='text-base py-3' >
                        {hike.description}
                    </p>
                </div>

                <dl className='d-flex mt-4 justify-content-between'>
                    <div className='d-flex flex-column'>
                        <dt>Max elevation</dt>
                        <dd className='m-0'>{hike.maxElevation} m</dd>
                    </div>
                    <div className='d-flex flex-column'>
                        <dt>Length</dt>
                        <dd className='m-0'>{hike.length} km</dd>
                    </div>
                    <div className='d-flex flex-column'>
                        <dt>Ascent</dt>
                        <dd className='m-0'>{hike.ascent} m</dd>
                    </div>
                </dl>
                <Link to={`/hikes/${hike.hikeId}`} className="text-decoration-none w-100" style={{ color: "currentcolor" }}>
                    <Button variant="primary-dark" className="fw-bold mt-4 w-100">
                        See more details
                    </Button>
                </Link>
            </div>
        </Col>
    )
}

export default HikeCard