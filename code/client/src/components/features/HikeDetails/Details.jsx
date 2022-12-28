import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaMapMarkerAlt, FaCrosshairs, FaPlay } from 'react-icons/fa'
import { GiHut } from 'react-icons/gi'
import DateTimePicker from 'react-datetime-picker';

import { getLocationFullName } from '@lib/helpers/location'
import { AuthContext } from '@contexts/authContext'
import { Tooltip } from '@components/ui-core'
import { HutCard } from '@components/features'

const Details = ({ hike }) => {
    const [user] = useContext(AuthContext)
    const [value, onChange] = useState(new Date());

    // TODO: Adding API call
    function handleStartHike() {
        if (value > new Date())
            toast.error("Start time cannot be in the future!", { theme: 'colored' })
    }

    return (
        <div className=''>
            <div className='mb-5'>
                {user.role === "Hiker" && (
                    <div className='d-flex flex-column align-items-start mb-3'>
                        <div className='d-flex flex-column mb-3'>
                            <span className='fw-bold'>Select start time</span>
                            <DateTimePicker onChange={onChange} value={value} />
                        </div>
                        <Button variant='success' className='fw-bold text-white d-flex align-items-center' onClick={handleStartHike}>
                            <FaPlay size={14} className="me-2" />
                            Start this hike
                        </Button>
                    </div>

                )}
                <h1 className='fw-black'>
                    {hike.title}
                    {(user.role === "Local Guide" && hike.writer.writerId === user.userId) &&
                        <span>
                            <Tooltip tip="Link start/end point">
                                <Link to={`/account/hikes/${hike.hikeId}/update/endpoints`}>
                                    <span className='text-primary fw-bold ms-4'>
                                        <FaCrosshairs size={20} />
                                    </span>
                                </Link>
                            </Tooltip>
                            <Tooltip tip="Update reference points">
                                <Link to={`/account/hikes/${hike.hikeId}/update/reference-points`}>
                                    <span className='text-primary fw-bold ms-2'>
                                        <FaMapMarkerAlt size={25} />
                                    </span>
                                </Link>
                            </Tooltip>
                            <Tooltip tip="Link huts">
                                <Link to={`/account/hikes/${hike.hikeId}/update/linked-huts`}>
                                    <span className='text-primary fw-bold ms-2'>
                                        <GiHut size={25} />
                                    </span>
                                </Link>
                            </Tooltip>
                        </span>}
                </h1>
                <h5 className='mb-2'>
                    Created by <span className='fw-bold'>{hike.writer.writerName}</span>{" "}
                    for <span className='fw-bold bg-primary-light px-3 fs-6 py-1 rounded-pill'>{hike.difficulty}</span>
                </h5>
                <span>{getLocationFullName(hike.province, hike.city)}</span>
            </div>
            <p>{hike.description}</p>
            <div className='mt-5 d-flex flex-column flex-lg-row justify-content-between'>
                {[
                    { label: "Start", ...hike.startPoint },
                    { label: "End", ...hike.endPoint }
                ].map((point) => (
                    <div key={`point-${point.label}`} className="mb-5 w-100 w-lg-50 px-lg-3">
                        <h4 className='me-2 m-0'>{point.label} point</h4>
                        <p className='m-0'>{point.name}</p>
                    </div>
                ))}
            </div>
            <div className='d-flex flex-column flex-lg-row justify-content-between'>
                <div className='w-100 w-lg-50 mb-5 px-lg-3'>
                    <h4>Reference points</h4>
                    <div className='d-flex flex-column'>
                        {hike.referencePoints.map((point) => (
                            <span key={`reference-point-${point.name}`} className='m-0'>{point.name}</span>
                        ))}
                    </div>
                </div>
                <div className='w-100 w-lg-50 px-lg-3'>
                    <h4 className='mb-3'>Useful info</h4>
                    <dl className='d-flex flex-column justify-content-between'>
                        {[
                            { label: "Elevation", value: `${hike.maxElevation} m` },
                            { label: "Length", value: `${hike.length} km` },
                            { label: "Ascent", value: `${hike.ascent} m` },
                            { label: "Expected RT time", value: `${hike.expectedTime.hours}h : ${hike.expectedTime.minutes}m` },
                        ].map((info) => (
                            <div key={`info-${info.label}`} className='d-flex mb-2'>
                                <dt className='me-2'>{info.label} |</dt>
                                <dd className='m-0'>{info.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            {hike.huts.length ?
                <div className='mt-5'>
                    <h3 className='fw-bold'>Linked huts</h3>
                    <Row className='g-4 mt-3'>
                        {hike.huts.map(hut => (
                            <HutCard key={hut.hutId} hut={hut} />
                        ))}
                    </Row>
                </div> : null
            }
        </div>
    )
}

export default Details