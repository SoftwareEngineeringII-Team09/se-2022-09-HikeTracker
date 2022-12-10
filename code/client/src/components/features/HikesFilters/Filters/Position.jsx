import { useState } from "react"
import { Row, Col, Button, Modal } from "react-bootstrap"

import { Field, useFormikContext } from "formik"
import { MapContainer, TileLayer } from 'react-leaflet'

import { Input } from '@components/form'
import { RadiusOnPoint } from "@components/features/Map"

const Position = ({ isOpen, close }) => {
    const { values, touched, setFieldValue } = useFormikContext()

    const { radius } = values.geoArea.position
    const { lat, lng } = values.geoArea.position.point

    const [point, setPoint] = useState({ lat, lng })

    const getCenter = () => {
        if (!point.lat && !point.lng)
            return [45.073811155764005, 7.687027960554972]
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