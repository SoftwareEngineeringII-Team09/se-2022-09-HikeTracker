import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'

import { MarkerOnPoint } from '@components/features/Map'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Select, Input } from '@components/form'
import { HutSchema } from '@lib/validations'

import regions from '@data/locations/regioni'
import provinces from '@data/locations/province'
import cities from '@data/locations/comuni'

import api from '@services/api'

const HutForm = () => {

    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const navigate = useNavigate()

    const handleSubmit = (values) => {
        api.huts.createHut({
            hutName: values.hutName,
            city: values.city,
            province: values.province,
            region: values.region,
            numOfBeds: values.numOfBeds,
            cost: values.cost,
            latitude,
            longitude,
            altitude: values.altitude,
            phone: values.phone,
            email: values.email,
            website: values.website
        })
            .then(() => {
                toast.success("The new hut has been correctly added", { theme: 'colored' })
                navigate('/', { replace: true })
            })
            .catch(err => console.log(err))
    }

    const handleClickOnMap = (point) => {
        setLatitude(point.latitude)
        setLongitude(point.longitude)
    }

    const initialValues = {
        hutName: "",
        city: 0,
        province: 0,
        region: 0,
        numOfBeds: 0,
        cost: 0,
        phone: "",
        email: "",
        website: "",
        latitude: 0,
        longitude: 0,
        altitude: 0
    };

    return (
        <>
            <div style={{ zIndex: 99 }} className="px-4">
                <div className='mb-5'>
                    <h1 className='fw-black m-0 display-1'>Insert hut data</h1>
                </div>
                <Formik className="my-2" initialValues={initialValues} validationSchema={HutSchema} onSubmit={(values) => handleSubmit(values)}>
                    {({ values }) => {
                        return (<Form data-testid="hut-form">
                            <Input id="hutName" name="hutName" type="text" label="Name:" placeholder="Hut name" className="mb-3" />
                            <Select id="region" name="region" defaultLabel="Select a region" label="Region" className="mb-3">
                                {regions.map(region => (
                                    <option key={region.regione} value={region.regione}>{region.nome}</option>
                                ))}
                            </Select>
                            <Select id="province" name="province" defaultLabel="Select a province" label="Province" className="mb-3">
                                {provinces.filter(province => province.regione === Number(values.region)).map(province => (
                                    <option key={province.provincia} value={province.provincia}>{province.nome}</option>
                                ))}
                            </Select>
                            <Select id="city" name="city" defaultLabel="Select a city" label="City" className="mb-3">
                                {cities.filter(city => city.provincia === Number(values.province)).map(city => (
                                    <option key={city.comune} value={city.comune}>{city.nome}</option>
                                ))}
                            </Select>

                            <div className='my-3'>
                                <p className='mb-2'>Click a point on the map to set the hut position</p>
                                <MapContainer center={[45.073811155764005, 7.687027960554972]} zoom={13} scrollWheelZoom style={{ height: 480 }}>
                                    <MarkerOnPoint point={{ latitude, longitude }} setPoint={handleClickOnMap} />
                                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                                </MapContainer>
                            </div>

                            <Input id="altitude" name="altitude" type="number" label="Altitude: (m)" placeholder="Hut name" min={0} max={10000} step={1} className="mb-3" />
                            <Input id="numOfBeds" name="numOfBeds" type="number" label="Number of beds:" placeholder="Hut name" min={0} step={1} className="mb-3" />
                            <Input id="phone" name="phone" type="string" label="Phone number:" placeholder="Phone number" className="mb-3" />
                            <Input id="email" name="email" type="email" label="Email:" placeholder="Email" className="mb-3" />
                            <Input id="website" name="website" type="string" label="Website: (optional)" placeholder="Website" className="mb-3" />
                            <Button variant="primary-dark fw-bold" type="submit" size='lg' className="w-100 py-3 fw-bold my-3">
                                Create new hut
                            </Button>
                        </Form>
                        )
                    }}
                </Formik>
            </div>
        </>
    );
}

export default HutForm;