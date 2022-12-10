import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { TbFilePlus } from 'react-icons/tb'
import { FaMapMarkerAlt, FaInfoCircle, FaCrosshairs } from 'react-icons/fa'
import { GiHut } from 'react-icons/gi'

import { Tooltip } from '@components/ui-core';
import api from '@services/api';
import { AuthContext } from '@contexts/authContext';
import { toast } from 'react-toastify';

const Hike = ({ hike }) => (
    <div className='d-flex align-items-center justify-content-between'>
        <h5 className='fw-bold m-0'>{hike.title}</h5>
        <div>
            <Tooltip tip="Link start/end point">
                <Link to={`/account/hikes/${hike.hikeId}/update/endpoints`}>
                    <span className='text-primary-dark fw-bold mx-2'>
                        <FaCrosshairs size={20} />
                    </span>
                </Link>
            </Tooltip>
            <Tooltip tip="Update reference points">
                <Link to={`/account/hikes/${hike.hikeId}/update/reference-points`}>
                    <span className='text-primary-dark fw-bold mx-2'>
                        <FaMapMarkerAlt size={20} />
                    </span>
                </Link>
            </Tooltip>
            <Tooltip tip="Link huts">
                <Link to={`/account/hikes/${hike.hikeId}/update/linked-huts`}>
                    <span className='text-primary-dark fw-bold mx-2'>
                        <GiHut size={20} />
                    </span>
                </Link>
            </Tooltip>
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

const ListHikes = () => {
    const [user] = useContext(AuthContext)
    const [hikes, setHikes] = useState(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading)
            api.hikes.getHikesForLocalGuide(user.userId)
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

export default ListHikes;