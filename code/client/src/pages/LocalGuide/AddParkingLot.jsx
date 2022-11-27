import { Row, Col, Button } from "react-bootstrap"
import { Formik, Form } from 'formik'
import { MapContainer, TileLayer } from "react-leaflet"
import { toast } from "react-toastify";

import api from "@services/api"

import { ParkingLotSchema } from "@lib/validations"
import { Input } from '@components/form'

import { MarkerOnPoint } from "@components/features/Map"

const AddParkingLot = () => {
    const initialValues = {
        parkingLotName: "",
        point: {
            longitude: null,
            latitude: null,
            // altitude: 0,
        }
    }

    const handleSubmit = (values) => {
        api.parkingLots.addParkingLot(values.parkingLotName, values.point)
            .then(() =>
                toast.success(`Parking Lot ${values.parkingLotName} has been correctly added`,
                    { theme: 'colored' }))
            .catch(err => toast.error(err, { theme: "colored" }))
    }

    return (
        <div className='my-5'>
            <div>
                <h1 className="fw-bold">Add a new parking lot</h1>
                <p>Click a point on the map to select the position of the new parking lot and type its name. That's all!</p>
            </div>
            <Formik initialValues={initialValues} validationSchema={ParkingLotSchema} onSubmit={(values) => handleSubmit(values)} >
                {({ touched, isValid, values, setFieldValue, setFieldTouched }) => {
                    const disabled = (!touched.parkingLotName
                        && (!touched.point || (touched.point && !touched.point.latitude && !touched.point.longitude)))
                        || !isValid

                    const handleClick = (point) => {
                        setFieldValue('point', point)
                        setFieldTouched('point')
                    }

                    return (
                        <Form>
                            <Row className='my-5 align-items-end justify-content-between'>
                                <Col xs={9} lg={10}>
                                    <Input id="parkingLotName" name="parkingLotName" placeholder="Insert the parking lot name" label="Name" />
                                </Col>
                                <Col xs={3} lg={2} className="ms-auto">
                                    <Button type="submit" variant="primary-dark" size="lg" className="fw-bold w-100 py-3" disabled={disabled}>
                                        Confirm
                                    </Button>
                                </Col>
                            </Row>
                            <MapContainer center={[45.073811155764005, 7.687027960554972]} zoom={13} scrollWheelZoom style={{ height: 480 }}>
                                <MarkerOnPoint point={values.point} setPoint={handleClick} />
                                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                            </MapContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default AddParkingLot