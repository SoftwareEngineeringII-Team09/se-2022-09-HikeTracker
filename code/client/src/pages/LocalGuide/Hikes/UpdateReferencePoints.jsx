import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Row, Col, Button, Spinner } from 'react-bootstrap'
import { toast } from "react-toastify"

import { isPointWithinRadius } from 'geolib'
import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet"
import { MarkerOnPoint } from "@components/features/Map"

import { Formik, Form } from 'formik'
import { ReferencePointSchema } from "@lib/validations"

import { AuthContext } from '@contexts/authContext'
import { Input } from '@components/form'
import api from '@services/api'

const RemoveButton = ({ point, onClick }) => {
    const handleClick = useCallback(() => onClick(point), [])

    return (
        <Button variant="link" size="sm" className="p-0 mt-2" onClick={handleClick}>
            Remove reference point
        </Button>
    )
}

const UpdateReferencePoints = () => {
    const [user] = useContext(AuthContext)
    const [points, setPoints] = useState([])
    const [hike, setHike] = useState(null)
    const [loading, setLoading] = useState(true)
    const { hikeId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (loading)
            api.hikes.getHikeDetails(hikeId)
                .then(hike => {
                    if (hike.writer.writerId !== user.userId) {
                        toast.error('Unauthorized operation', { theme: 'colored' })
                        navigate('/account/hikes')
                    }
                    setHike(hike)
                    setPoints(hike.referencePoints)
                })
                .catch(err => toast.error(err, { theme: 'colored' }))
                .finally(() => setLoading(false))
    }, [loading, hikeId]) // eslint-disable-line

    const initialValues = {
        referencePointName: "",
        point: {
            latitude: null,
            longitude: null,
        }
    }

    const handleAddPoint = useCallback((values, { resetForm }) => {
        const { latitude, longitude } = values.point
        setPoints(old => [...old, { name: values.referencePointName, coords: [latitude, longitude] }])
        resetForm()
    }, [])

    const handleSaveChanges = useCallback(() => {
        api.hikes.updateReferencePoints(hikeId, points)
            .then(() => {
                toast.success("Reference points have been correctly updated!", { theme: 'colored' })
                navigate(`/hikes/${hikeId}`, { replace: true })
            })
            .catch(err => toast.error(err, { theme: 'colored' }))
    }, [points])

    if (!loading && hike)
        return (
            <div className="my-5">
                <div>
                    <h1 className="fw-bold">Add new reference points to the hike</h1>
                    <p>
                        If some reference point already exists, you can see it on the map.
                        If you want to add new reference points, you can click on the map, type a name for it and then click on Add new point button.
                        You can also remove a reference point: you have just to click on the marker and then on Remove reference point.
                    </p>
                    <p className="fw-bold">
                        Have you already done? Click on Save changes button on the bottom!
                    </p>
                    <Formik initialValues={initialValues} validationSchema={ReferencePointSchema} onSubmit={handleAddPoint}>
                        {({ values, touched, isValid, setFieldValue, setFieldTouched }) => {
                            const disabled = (!touched.referencePointName
                                && (!touched.point || (touched.point && !touched.point.latitude && !touched.point.longitude)))
                                || !isValid

                            function handleClick(point) {
                                if (hike.track.some(trackPoint => {
                                    const { latitude, longitude } = point
                                    return isPointWithinRadius(
                                        { latitude: trackPoint[0], longitude: trackPoint[1] },
                                        { latitude, longitude },
                                        100
                                    )
                                })) {
                                    setFieldValue('point', point)
                                    setFieldTouched('point')
                                }
                            }

                            function handleRemovePoint(point) {
                                setPoints(old => old.filter(p => p !== point))
                            }

                            return (
                                <Form>
                                    <Row className="my-5 align-items-end">
                                        <Col xs={9}>
                                            <Input id="reference-point-name" name="referencePointName" placeholder="A new amazing reference point" label="Name" />
                                        </Col>
                                        <Col xs={3}>
                                            <Button type="submit" variant="primary-dark" size="lg" className="fw-bold py-3 w-100" disabled={disabled}>
                                                Add new point
                                            </Button>
                                        </Col>
                                    </Row>
                                    <MapContainer data-testid="map" center={hike.startPoint.coords} zoom={12} scrollWheelZoom style={{ height: 480 }} className="mt-5">
                                        <MarkerOnPoint point={values.point} setPoint={handleClick} />
                                        {points.map((point) => (
                                            <Marker key={`point-${point.name}`} position={point.coords}>
                                                <Popup>
                                                    <p className='m-0'>{point.name}</p>
                                                    <RemoveButton point={point} onClick={handleRemovePoint} />
                                                </Popup>
                                            </Marker>
                                        ))}
                                        <Polyline pathOptions={{ color: "red" }} positions={hike.track} />
                                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                                    </MapContainer>
                                </Form>
                            )
                        }}
                    </Formik>
                    <Button variant="primary-dark" size="lg" className="fw-bold py-3 w-100 mt-5" onClick={handleSaveChanges}>
                        Save changes
                    </Button>
                </div>
            </div>
        )
    else if (!loading && !hike)
        return (
            <div className="my-5 d-flex justify-content-center">
                <h3 className="fw-bold text-danger">Ops... something went wrong</h3>
            </div>
        )
    else return (
        <div role="status" className='h-100vh position-absolute top-50 start-50'>
            <Spinner animation="border" variant="primary-dark" />
        </div>
    )
}

export default UpdateReferencePoints