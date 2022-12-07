import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { Col, Button, Alert, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { AuthContext } from '@contexts/authContext'
import api from '@services/api'

import { HikeDetails } from '@components/features'

const Hike = () => {
    const [user] = useContext(AuthContext)
    const [hike, setHike] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const { hikeId } = useParams()

    useEffect(() => {
        api.hikes.getHikeDetails(hikeId)
            .then(hike => setHike(hike))
            .catch(err => {
                setHike(null)
                toast.error(err, { theme: 'colored' })
            })
            .finally(() => setLoading(false))
    }, []) // eslint-disable-line

    const handleDownload = () => {
        api.hikes.getHikeGPXFile(hikeId)
            .then((res) => {
                console.log(res)
                const url = window.URL.createObjectURL(new Blob([res]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${hike.title.replace(" ", "_")}.gpx`)
                document.body.appendChild(link)
                link.click()
            })
            .catch(err => toast.error(err, { theme: 'colored' }))
    }

    if (!loading && hike)
        return (
            <Col xs={12} xl={user.loggedIn ? 6 : 10} className={`${user.loggedIn ? "ms-auto" : "mx-auto"} my-5`}>
                {user.loggedIn &&
                    <HikeDetails.TrackMap hikeId={hikeId} start={hike.startPoint} end={hike.endPoint} track={hike.track} references={hike.referencePoints} />}
                {!user.loggedIn &&
                    <Alert variant='warning' className='mb-5'>
                        You should be an autenticated hiker to see the map and to be able to download the track as a <code style={{ color: "currentcolor" }}>.gpx</code> file
                    </Alert>}
                <HikeDetails.Details hike={hike} />
                {user.loggedIn &&
                    <Button variant='primary-light fw-bold mt-5 w-100' size='lg' onClick={handleDownload}>
                        Download track
                    </Button>}
            </Col>
        )
    else if (loading) return (
        <div role="status" className='h-100vh position-absolute top-50 start-50'>
            <Spinner animation="border" variant="primary-dark" />
        </div>
    )
    else return (
        <div role="status" className='text-danger fw-bold d-flex align-items-center justify-content-center'>
            <h3>Ops... something went wrong</h3>
        </div>
    )
}

export default Hike