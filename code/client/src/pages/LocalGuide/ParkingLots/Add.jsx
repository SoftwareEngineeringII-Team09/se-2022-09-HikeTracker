import { useNavigate } from 'react-router-dom'
import { Button } from "react-bootstrap"
import { Formik, Form } from 'formik'
import { MapContainer, TileLayer } from "react-leaflet"
import { toast } from "react-toastify";

import api from "@services/api"

import { ParkingLotSchema } from "@lib/validations"
import { Input } from '@components/form'

import { MarkerOnPoint } from "@components/features/Map"

const AddParkingLot = () => {
    const navigate = useNavigate()

    const initialValues = {
        parkingLotName: "",
        capacity: null,
        altitude: null,
        point: {
            latitude: null,
            longitude: null
        }
    }

    function handleSubmit(values) {
        const parkingLotData = Number.isNaN(parseFloat(values.altitude)) ? {
            parkingLotName: values.parkingLotName,
            capacity: parseInt(values.capacity),
            latitude: values.point.latitude,
            longitude: values.point.longitude
        } : {
            parkingLotName: values.parkingLotName,
            capacity: parseInt(values.capacity),
            altitude: parseFloat(values.altitude),
            latitude: values.point.latitude,
            longitude: values.point.longitude,
        };
        api.parkingLots.addParkingLot(parkingLotData)
            .then(() => {
                toast.success(`Parking Lot ${values.parkingLotName} has been correctly added`,
                    { theme: 'colored' })
                navigate('/')
            })
            .catch(err => toast.error(err, { theme: "colored" }))
    }

    return (
        <div className='my-5'>
            <div className='mb-4'>
                <h1 className="fw-bold">Add a new parking lot</h1>
            </div>
            <Formik initialValues={initialValues} validationSchema={ParkingLotSchema} onSubmit={handleSubmit} >
                {({ touched, isValid, values, setFieldValue, setFieldTouched }) => {
                    const disabled = (!touched.parkingLotName && !touched.capacity
                        && (!touched.point || (touched.point && !touched.point.latitude && !touched.point.longitude)))
                        || !isValid

                    function handleClick(point) {
                        setFieldValue('point', point)
                        setFieldTouched('point')
                    }

                    return (
                        <Form>
                            <Input id="parkingLotName" name="parkingLotName" className="mb-3" placeholder="Insert the name" label="Name" />
                            <Input id="capacity" name="capacity" className="mb-3" placeholder="Insert the capacity" label="Capacity" />
                            <Input id="altitude" name="altitude" className="mb-3" placeholder="Optionally insert the altitude" label="Altitude" />
                            <div className="my-3">
                                <p className="mb-2">Click a point on the map to set parking lot position</p>
                                <MapContainer center={[45.073811155764005, 7.687027960554972]} zoom={13} scrollWheelZoom style={{ height: 480 }}>
                                    <MarkerOnPoint point={values.point} setPoint={handleClick} />
                                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                                </MapContainer>
                            </div>
                            <Button type="submit" variant="primary-light fw-bold py-3" size="lg" className="mb-3" disabled={disabled}>
                                Create new parking lot
                            </Button>
                        </Form>
                    )
                }}
            </Formik>
        </div >
    )
}

export default AddParkingLot