import { useState, useEffect } from "react"
import { Row, Col, Button, Modal } from "react-bootstrap"
import { FaExclamationCircle } from 'react-icons/fa'
import { toast } from "react-toastify"

import { Field, useFormikContext } from "formik"
import { MapContainer, TileLayer } from 'react-leaflet'

import { Input } from '@components/form'
import { RadiusOnPoint } from "@components/features/Map"

const Position = ({ isOpen, close }) => {
    const { values, touched, setFieldValue } = useFormikContext()

    const { radius } = values.geoArea.position
    const { lat, lng } = values.geoArea.position.point

    const [position, setPosition] = useState(null)
    const [point, setPoint] = useState({ lat, lng })
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!point.lat && !point.lng)
            navigator.geolocation.getCurrentPosition(
                (pos) => setPosition(pos.coords),
                (err) => {
                    setError(err.message)
                    toast.error(err.message, { theme: 'colored' })
                })
    }, [point.lat, point.lng])

    const getCenter = () => {
        if (position && !point.lat && !point.lng)
            return [position.latitude, position.longitude]
        else return [point.lat, point.lng]
    }

    const handleConfirm = () => {
        if (touched.geoArea && touched.geoArea.position)
            setPoint({ lat, lng })
        else setFieldValue('geoArea.position.point', point)
        close()
    }

    return (
        <Modal show={isOpen} onHide={close} size="xl">
            <Modal.Header closeButton className="px-5 text-primary-dark">
                <Modal.Title className="fw-bold">Click a point on the map and select a radius</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-5">
                {position || (point.lat && point.lng) ?
                    <>
                        <MapContainer center={getCenter()} zoom={13} scrollWheelZoom style={{ height: 500 }}>
                            <RadiusOnPoint radius={radius} currentPoint={point} setCurrentPoint={setPoint} />
                            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                        </MapContainer>
                        <div className="mt-5">
                            <Row className="mb-3">
                                {[
                                    { coord: "lat", label: "Latitude" },
                                    { coord: "lng", label: "Longitude" }
                                ].map((item, idx) => (
                                    <Col key={idx} xs={6} >
                                        <Input id={`point-${item.coord}`} name={`geoArea.position.point.${item.coord}`} type="text" label={item.label} />
                                    </Col>
                                ))}
                            </Row>
                            <h6 className="fw-bold text-primary-dark mb-3">Radius</h6>
                            <Field type="range" name="geoArea.position.radius" className="w-100" />
                        </div>
                    </>
                    : <div data-testid="error-message" className="text-danger fw-bold d-flex align-items-end">
                        <FaExclamationCircle size={24} className="me-2" />
                        {error}
                    </div>}
            </Modal.Body>
            <Modal.Footer className="px-5">
                <Button variant="base" onClick={close} className="fw-bold">
                    Close
                </Button>
                <Button variant="primary-dark" onClick={handleConfirm} className="fw-bold">
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Position;