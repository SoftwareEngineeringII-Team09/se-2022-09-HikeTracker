import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Col, Alert, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import api from '@services/api'

import { HutDetails } from '@components/features'

const Hut = () => {
    const [hut, setHut] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [user] = useState(true)
    const { hutId } = useParams()

    useEffect(() => {
        api.huts.getHutDetails(hutId)
            .then(res => setHut(res.hut))
            .catch(err => {
                setHut(null)
                toast.error(err.message, { theme: 'colored' })
            })
            .finally(() => setLoading(false))
    }, []) // eslint-disable-line

    if (!loading && hut)
        return (
            <Col xs={12} xl={user ? 6 : 10} className={`${user ? "ms-auto" : "mx-auto"} my-5`}>
                {user &&
                    <HutDetails.TrackMap p={hut.coords} />}
                {!user &&
                    <Alert variant='warning' className='mb-5'>
                        You should be an autenticated hiker to see the map.
                    </Alert>}
                <HutDetails.Details hut={hut} />
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

export default Hut