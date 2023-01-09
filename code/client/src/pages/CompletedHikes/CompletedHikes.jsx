import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Spinner } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa'

import { Tooltip } from '@components/ui-core';
import api from '@services/api';
import { AuthContext } from '@contexts/authContext';
import { toast } from 'react-toastify';

const Hike = ({ hike }) => (
    <div className='d-flex align-items-center justify-content-between'>
        <h5 className='fw-bold m-0'>{hike.title}</h5>
        <div>
            <span className='text-primary-dark fw-bold mx-2'>Started:&nbsp;{hike.startTime}</span>
        </div>
        <div>
            <span className='text-primary-dark fw-bold mx-2'>Ended:&nbsp;{hike.endTime}</span>
        </div>
        <div>
            <Tooltip tip="See more details">
                <Link to={`/hikes/${hike.hikeId}`}>
                    <span className='text-primary-dark fw-bold mx-2'>
                        <FaInfoCircle size={20} />
                    </span>
                </Link>
            </Tooltip>
        </div>
    </div>
)

const CompletedHikes = () => {
    const [user] = useContext(AuthContext)
    const [hikes, setHikes] = useState(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading)
            api.hikes.getCompletedHikes(user.userId)
                .then((hikes) => setHikes(hikes))
                .catch((err) => {
                    setHikes([])
                    toast.error(err, { theme: "colored" })
                })
                .finally(() => setLoading(false))
    }, [loading]) // eslint-disable-line

    if (!loading)
        return (
            <div className='my-5'>
                <div className='mb-5'>
                    <h1 className="fw-bold">Completed hikes</h1>
                    <p>Here is the list of all the hikes you have completed since now!</p>
                </div>
                <Row className='my-5 gy-3'>
                    {!hikes.length ? <span className='fs-5'>No hikes here...</span>
                        : hikes.map(hike => (
                            <Col key={hike.hikeId} xs={12} className='bg-base-light py-3 px-5 rounded-3'>
                                <Hike hike={hike} />
                            </Col>
                        ))}
                </Row>
            </div >
        );
    else return (
        <div role="status" className='h-100vh position-absolute top-50 start-50'>
            <Spinner animation="border" variant="primary-dark" />
        </div>
    )
}

export default CompletedHikes;