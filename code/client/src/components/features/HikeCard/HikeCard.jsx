import { Link } from "react-router-dom"
import { Col } from "react-bootstrap"

const HikeCard = ({ hike }) => {
    return (
        <Col xs={12} lg={6} xl={4}>
            <Link to={`/browse/${hike.id}`} className="text-decoration-none" style={{ color: "currentcolor" }}>
                <div className='bg-base-light p-4 h-100 rounded-3 d-flex flex-column'>
                    <div className='mb-3'>
                        <h3 className='fw-bold m-0'>{hike.title}</h3>
                        <span>Created by {hike.writer}</span>
                    </div>
                    <p className='text-base py-3 text-truncate'>
                        {hike.description}
                    </p>

                    <dl className='d-flex justify-content-between'>
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
                            <dd className='m-0'>{hike.totalAscent} m</dd>
                        </div>
                    </dl>
                </div>
            </Link>
        </Col>
    )
}

export default HikeCard