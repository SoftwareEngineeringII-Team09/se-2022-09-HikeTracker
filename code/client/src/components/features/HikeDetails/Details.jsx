import { useContext, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaStop, FaCrosshairs, FaPlay } from 'react-icons/fa'
import { GiHut } from 'react-icons/gi'
import { useStopwatch } from 'react-timer-hook'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { getLocationFullName } from '@lib/helpers/location'
import { AuthContext } from '@contexts/authContext'
import { Tooltip } from '@components/ui-core'
import { HutCard } from '@components/features'
import { Row, Button, Image, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import api from '@services/api'
import DateTimePicker from 'react-datetime-picker';

import { SERVER_PORT } from '@services/config'

dayjs.extend(customParseFormat)

const Timewatch = ({ days, hours, minutes, seconds }) => (
    <div data-testid="timewatch" className='fs-3 my-3'>
        <h3 className='fw-bold fs-5 mb-3'>Timewatch</h3>
        <span className='p-2 rounded-3 bg-primary-light me-1'>{days}</span>
        :
        <span className='p-2 rounded-3 bg-primary-light mx-1'>{hours}</span>
        :
        <span className='p-2 rounded-3 bg-primary-light mx-1'>{minutes}</span>
        :
        <span className='p-2 rounded-3 bg-primary-light ms-1'>{seconds}</span>
    </div>
)

const Details = ({ hike }) => {
    const [user] = useContext(AuthContext)
    const [value, onChange] = useState(new Date());
    const [startedHike, setStartedHike] = useState(null)
    const [terminateTime, setTerminateTime] = useState(null);
    const [loading, setLoading] = useState(user?.role === "Hiker")
    const {
        seconds,
        minutes,
        hours,
        days,
        reset
    } = useStopwatch({ autoStart: false, stopwatchOffset: new Date() });

    useEffect(() => {
        if (loading) {
            api.hikes.getStartedHike()
                .then((startedHike) => {
                    setStartedHike(startedHike)
                    setTerminateTime(new Date())
                    if (startedHike.hikeId === hike.hikeId) {
                        const start = dayjs(startedHike.startTime, 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY, HH:mm:ss')
                        const currentTime = dayjs().format('DD/MM/YYYY, HH:mm:ss');
                        const diff = dayjs(currentTime).diff(start, 's')
                        const stopwatchOffset = new Date();
                        stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + diff);
                        reset(stopwatchOffset, true);
                    }
                })
                .catch((err) => err.status === 404 ?
                    setStartedHike(null) :
                    toast.error(err.data.error, { theme: "colored" }))
                .finally(() => setLoading(false))

        }
    }, [loading]) // eslint-disable-line

    function handleStartHike() {
        if (value > new Date())
            toast.error("Start time cannot be in the future!", { theme: 'colored' })
        else {
            const startTime = dayjs(value).format('DD/MM/YYYY, HH:mm:ss')
            api.hikes.startHike(hike.hikeId, startTime)
                .then(() => {
                    setLoading(true)
                    toast.success("Hike correctly started!", { theme: 'colored' })
                })
                .catch(err => toast.error(err, { theme: 'colored' }))
        }
    }

    const handleTerminateHike = useCallback(() => {
        const start = dayjs(startedHike.startTime, 'DD/MM/YYYY, HH:mm:ss')
        const end = dayjs(terminateTime)
        const now = dayjs()

        if (!startedHike)
            return toast.error("You need to start a hike first", { theme: 'colored' });

        if (dayjs(end).isBefore(start))
            return toast.error("End time must be after start time", { theme: 'colored' });

        if (dayjs(end).isAfter(now))
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

    if (!loading)
        return (
            <div className=''>
                <div className='mb-5'>
                    {(user.loggedIn && user.role === "Hiker") && (
                        startedHike?.hikeId === hike.hikeId ?
                            <>
                                <Timewatch days={days} hours={hours} minutes={minutes} seconds={seconds} />
                                <div className='d-flex flex-column align-items-start mb-3'>
                                    <div className='d-flex flex-column mb-3'>
                                        <label htmlFor='terminateTime' className='fw-bold'>Select end time</label>
                                        <DateTimePicker name="terminateTime" id='terminateTime' onChange={setTerminateTime} value={terminateTime} />
                                    </div>
                                    <Button disabled={loading} variant='danger' className='fw-bold text-white d-flex align-items-center' onClick={handleTerminateHike}>
                                        {loading ? <Spinner /> : <><FaStop size={14} className="me-2" /> Terminate hike</>}
                                    </Button>
                                </div>
                            </>
                            :
                            (startedHike ?
                                <div className='mb-3'>
                                    <span className='text-warning'>You cannot start this hike because you have already started another hike... You have to terminate that hike before.</span>
                                </div>
                                :
                                <div className='d-flex flex-column align-items-start mb-3'>
                                    <div className='d-flex flex-column mb-3'>
                                        <span className='fw-bold'>Select start time</span>
                                        <DateTimePicker onChange={onChange} value={value} />
                                    </div>
                                    <Button variant='success' className='fw-bold text-white d-flex align-items-center' onClick={handleStartHike}>
                                        <FaPlay size={14} className="me-2" />
                                        Start this hike
                                    </Button>
                                </div >
                            ))}
                    <Image fluid src={`http://localhost:${SERVER_PORT}/${hike.hikeImage}`} alt="Hike cover" className="rounded-3 mb-5" style={{ objectFit: 'cover', maxHeight: '25rem', width: '100%' }} />
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
                </div >
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
                {
                    hike.huts.length ?
                        <div className='mt-5'>
                            <h3 className='fw-bold'>Linked huts</h3>
                            <Row className='g-4 mt-3'>
                                {hike.huts.map(hut => (
                                    <HutCard key={hut.hutId} hut={hut} />
                                ))}
                            </Row>
                        </div> : null
                }
            </div >
        )
}

export default Details