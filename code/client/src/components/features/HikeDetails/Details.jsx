import { useContext, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaStop, FaCrosshairs } from 'react-icons/fa'
import { GiHut } from 'react-icons/gi'

import { getLocationFullName } from '@lib/helpers/location'
import { AuthContext } from '@contexts/authContext'
import { Tooltip } from '@components/ui-core'
import { HutCard } from '@components/features'
import { Row, Button, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import api from '@services/api'
import DateTimePicker from 'react-datetime-picker';

const Details = ({ hike }) => {
    const [user] = useContext(AuthContext)
    const [startedHike, setStartedHike] = useState({
        selectedHikeId: 1,
    })
    const [terminateTime, setTerminateTime] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const handleTerminateHike = useCallback(() => {

        if (!startedHike) 
        return toast.error("You need to start a hike first", { theme: 'colored' });
        
        const startTime = terminateTime; // TODO: Remove this line once startTime is set
        if (terminateTime > startTime)
        return toast.error("End time must be after start time", { theme: 'colored' });
        
        if (terminateTime > new Date())
            return toast.error("End time cannot be in the future", { theme: 'colored' });

        setLoading(true);
        api.selectedHikes.terminateHike(startedHike.selectedHikeId, terminateTime.toLocaleString("it-IT"))
            .then(() => {
                setStartedHike(undefined);
                toast.success("Hike terminated", { theme: 'colored' });
            })
            .catch(err => {
                toast.error(err, { theme: 'colored' });
            })
            .finally(() => setLoading(false));

    }, [startedHike, terminateTime]);

    return (
        <div className=''>
            <div className='mb-5'>

                {
                    startedHike &&
                    <div className='d-flex flex-column align-items-start mb-3'>
                        <div className='d-flex flex-column mb-3'>
                            <label for='terminateTime' className='fw-bold'>Select end time</label>
                            <DateTimePicker name="terminateTime" id='terminateTime' onChange={setTerminateTime} value={terminateTime} />
                        </div>
                        <Button disabled={loading} variant='success' className='fw-bold text-white d-flex align-items-center' onClick={handleTerminateHike}>
                            {loading ? <Spinner /> : <><FaStop size={14} className="me-2" /> Terminate hike</>}
                        </Button>
                    </div>
                }
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
                ].map((point, idx) => (
                    <div key={`point-${idx}`} className="mb-5 w-100 w-lg-50 px-lg-3">
                        <h4 className='me-2 m-0'>{point.label} point</h4>
                        <p className='m-0'>{point.name}</p>
                    </div>
                ))}
            </div>
            <div className='d-flex flex-column flex-lg-row justify-content-between'>
                <div className='w-100 w-lg-50 mb-5 px-lg-3'>
                    <h4>Reference points</h4>
                    <div className='d-flex flex-column'>
                        {hike.referencePoints.map((point, idx) => (
                            <span key={`reference-point-${idx}`} className='m-0'>{point.name}</span>
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
                        ].map((info, idx) => (
                            <div key={`info-${idx}`} className='d-flex mb-2'>
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