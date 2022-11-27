import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import regions from '@data/locations/regioni'
import provinces from '@data/locations/province'
import cities from '@data/locations/comuni'

const HutForm = () => {
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [beds, setBeds] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();
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
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="address">Address:</Form.Label>
                        <Form.Control id="address" type='text' required onChange={event => setAddress(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="latitude">Latitude:</Form.Label>
                        <Form.Control id="latitude" type='number' min={-90} max={90} step={0.0000001} required onChange={event => setLatitude(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor="longitude">Longitude:</Form.Label>
                        <Form.Control id="longitude" type='number' min={-180} max={180} step={0.0000001} required onChange={event => setLongitude(event.target.value)} />
                    </Form.Group>
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

export default HutForm;