import { useState, useEffect } from "react"
import { Row, Col, Button, Modal } from "react-bootstrap"
import { FaMapMarkedAlt, FaExclamationCircle } from 'react-icons/fa'
import { toast } from "react-toastify"

import { Field, useFormikContext } from "formik"
import { MapContainer, TileLayer, Circle, useMapEvents, } from 'react-leaflet'

import { __PROVINCES, getCitiesForProvince } from '@lib/helpers/location'
import { Select, Input } from '@components/form'

const RadiusOnPoint = ({ radius, currentPoint, setCurrentPoint }) => {
    const map = useMapEvents({
        click: (e) => {
            setCurrentPoint({ lat: e.latlng.lat, lng: e.latlng.lng })
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return currentPoint.lat && currentPoint.lng ? <Circle center={[currentPoint.lat, currentPoint.lng]} radius={radius * 1000} /> : null
}

const MapModal = ({ isOpen, onHide }) => {
    const { values, touched, setFieldValue } = useFormikContext()

    const { radius } = values.geoArea.position
    const { lat, lng } = values.geoArea.position.point

    const [position, setPosition] = useState(null)
    const [point, setPoint] = useState({ lat, lng })
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!point.longitude && !point.latitude)
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition(pos.coords)
            }, (err) => {
                setError(err.message)
                toast.error(err.message, { theme: 'colored' })
            })
    }, [point.latitude, point.longitude])

    const getCenter = () => {
        if (position && !point.lat && !point.lng)
            return [position.latitude, position.longitude]
        else return [point.lat, point.lng]
    }

    const handleConfirm = () => {
        if (touched.geoArea && touched.geoArea.position)
            setPoint({ lat, lng })
        else setFieldValue('geoArea.position.point', point)
        onHide()
    }

    if (position || (point.latitude && point.longitude))
        return (
            <Modal show={isOpen} onHide={onHide} size="xl">
                <Modal.Header closeButton className="px-5 text-primary-dark">
                    <Modal.Title className="fw-bold">Click a point on the map and select a radius</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-5">
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
                        <h6 className="fw-bold text-primary-dark mb-3">
                            Radius
                        </h6>
                        <Field type="range" name="geoArea.position.radius" className="w-100" />
                    </div>
                </Modal.Body>
                <Modal.Footer className="px-5">
                    <Button variant="base" onClick={onHide} className="fw-bold">
                        Close
                    </Button>
                    <Button variant="primary-dark" onClick={handleConfirm} className="fw-bold">
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    else return (
        <Modal show={isOpen} onHide={onHide} size="xl">
            <Modal.Body className="px-5 text-danger fw-bold d-flex align-items-end">
                <FaExclamationCircle size={24} className="me-2" />
                {error}
            </Modal.Body>
        </Modal>
    )
}

const GeoArea = () => {
    const { values } = useFormikContext()
    const [openMap, setOpenMap] = useState(false)

    const { province } = values.geoArea.location

    return (
        <div className="mb-5">
            <Row className="mb-5">
                <h4 className="fw-bold mb-3">Geographic area</h4>
                <Col xs={12} lg={6}>
                    <Select id={`location-province`} name={`geoArea.location.province`} label="Province" defaultLabel="Leave this field empty">
                        {__PROVINCES.map(p => (
                            <option key={p.istat_provincia} value={p.istat_provincia}>{p.provincia}</option>
                        ))}
                    </Select>
                </Col>
                <Col xs={12} lg={6}>
                    <Select id={`location-city`} name={`geoArea.location.city`} label="City" defaultLabel="Leave this field empty" disabled={!parseInt(province)}>
                        {getCitiesForProvince(parseInt(province))
                            .map(c => (
                                <option key={c.codiceistatcomune} value={c.codiceistatcomune}>{c.comune}</option>
                            ))}
                    </Select>
                </Col>

            </Row>
            <Button variant="link text-primary text-decoration-none p-0 d-flex align-items-end" onClick={() => setOpenMap(true)}>
                <FaMapMarkedAlt size="32" className="me-2" />
                Click to open the map and select a radius
            </Button>
            <MapModal isOpen={openMap} onHide={() => setOpenMap(false)} />
        </div>
    )
}

export default GeoArea