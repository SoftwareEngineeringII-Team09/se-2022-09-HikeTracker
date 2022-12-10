import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify'

import { MarkerOnPoint } from '@components/features/Map'
import { MapContainer, TileLayer } from 'react-leaflet'

import regions from '@data/locations/regioni'
import provinces from '@data/locations/province'
import cities from '@data/locations/comuni'

import api from '@services/api'

const AddHut = () => {
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [beds, setBeds] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        api.huts.createHut({
            hutName: name,
            city,
            province,
            region,
            numOfBeds: parseInt(beds),
            cost: 10.5,
            latitude,
            longitude,
            altitude: parseInt(altitude)
        }).then(() => {
            toast.success("The new hut has been correctly added", { theme: 'colored' })
            navigate('/', { replace: true })
        })
            .catch(err => toast.error(err, { theme: 'colored' }))

    }

    const handleClickOnMap = (point) => {
        setLatitude(point.latitude)
        setLongitude(point.longitude)
    }

    return (
        <>
            <div style={{ zIndex: 99 }} className="px-4">
                <div className='mb-5'>
                    <h1 className='fw-black m-0 display-1'>Insert hut data</h1>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="name">Name:</Form.Label>
                        <Form.Control id="name" type='text' required placeholder='Hut name' onChange={event => setName(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="region">Region:</Form.Label>
                        <Form.Select id='region' required onChange={(e) => setRegion(parseInt(e.target.value))}>
                            <option value={0}>Select a region</option>
                            {regions.map(region => (
                                <option key={region.regione} value={region.regione}>{region.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor='province'>Province:</Form.Label>
                        <Form.Select id='province' required onChange={(e) => setProvince(parseInt(e.target.value))}>
                            <option value={0}>Select a provice</option>
                            {provinces.filter(province => province.regione === region).map(province => (
                                <option key={province.provincia} value={province.provincia}>{province.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor='city'>City:</Form.Label>
                        <Form.Select id='city' required onChange={(e) => setCity(parseInt(e.target.value))}>
                            <option value={0}>I want to leave this field empty</option>
                            {cities.filter(city => city.provincia === province).map(city => (
                                <option key={city.comune} value={city.comune}>{city.nome}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <div className='my-3'>
                        <p className='mb-2'>Click a point on the map to set hut position</p>
                        <MapContainer center={[45.073811155764005, 7.687027960554972]} zoom={13} scrollWheelZoom style={{ height: 480 }}>
                            <MarkerOnPoint point={{ latitude, longitude }} setPoint={handleClickOnMap} />
                            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png" />
                        </MapContainer>
                    </div>

                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="altitude">Altitude: (m)</Form.Label>
                        <Form.Control id="altitude" type='number' min={0} max={8000} step={1} required onChange={event => setAltitude(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="numberOfBeds">Number of beds:</Form.Label>
                        <Form.Control id="numberOfBeds" type='number' min={1} step={1} required onChange={event => setBeds(event.target.value)} />
                    </Form.Group>
                    <Button variant='primary-light fw-bold' size='lg' type='submit' className='mb-3'>
                        Create new hut
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default AddHut;