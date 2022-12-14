import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'

import { MarkerOnPoint } from '@components/features/Map'
import { MapContainer, TileLayer } from 'react-leaflet'

import { Select, Input, File, LoadingButton } from '@components/form'

import { HutSchema } from '@lib/validations'

import regions from '@data/locations/regioni'
import provinces from '@data/locations/province'
import cities from '@data/locations/comuni'

import api from '@services/api'

const AddHut = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = useCallback((values) => {
        setLoading(true)
        const data = new FormData();
        Object.entries(values).forEach(([k, v]) => data.append(k, v))
        api.geolocalization.checkPointCity({ longitude: values.longitude, latitude: values.latitude }, values.city)
            .then(() => api.huts.createHut(data)
                .then(() => {
                    toast.success("The new hut has been correctly added", { theme: 'colored' })
                    navigate('/', { replace: true })
                })
                .catch(err => toast.error(err, { theme: 'colored' }))
                .finally(() => setLoading(false)))

            .catch(err => toast.error(err, { theme: 'colored' }))
            .finally(() => setLoading(false))
    }, []) // eslint-disable-line

    const initialValues = {
        hutName: "",
        region: 0,
        province: 0,
        city: 0,
        numOfBeds: 0,
        cost: 0,
        phone: "",
        email: "",
        website: "",
        latitude: 0,
        longitude: 0,
        altitude: 0,
        hutImage: ""
    };

    return (
        <div className='my-5'>
            <div className='mb-4'>
                <h1 className="fw-bold">Add a new hut</h1>
                <p>Add a new hut so that hiker can see its info and better plan his hikes.</p>
            </div>
            <Formik className="my-2" initialValues={initialValues} validationSchema={HutSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => {
                    const handleClickOnMap = (point) => {
                        setFieldValue('latitude', point.latitude)
                        setFieldValue('longitude', point.longitude)
                    }

                    return (<Form data-testid="hut-form">
                        <Input id="hutName" name="hutName" type="text" label="Name" placeholder="Hut name" className="mb-3" />
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
                                <MarkerOnPoint point={{ latitude: values.latitude, longitude: values.longitude }} setPoint={handleClickOnMap} />
                                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                            </MapContainer>
                        </div>

                        <Input id="altitude" name="altitude" type="number" label="Altitude (m)" placeholder="Hut name" min={0} max={10000} step={1} className="mb-3" />
                        <Input id="numOfBeds" name="numOfBeds" type="number" label="Number of beds" placeholder="Hut name" min={0} step={1} className="mb-3" />
                        <Input id="phone" name="phone" type="text" label="Phone number" placeholder="Phone number" className="mb-3" />
                        <Input id="email" name="email" type="email" label="Email" placeholder="Email" className="mb-3" />
                        <Input id="website" name="website" type="text" label="Website (optional)" placeholder="Website" className="mb-3" />

                        <File id="hutImage" name="hutImage" type="file" accept="image/*" label="Cover image" className="mb-3" onChange={(e) => {
                            setFieldValue('hutImage', e.currentTarget.files[0])
                        }} />

                        <LoadingButton type="submit" text="Create new hut" loading={loading} />
                    </Form>
                    )
                }}
            </Formik>
        </div>
    );
}

export default AddHut;