import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import provinces from '@data/provinces'
import cities from '@data/cities'

const HutForm = () => {
    const [name, setName] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [beds, setBeds] = useState(0);

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
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type='text' required placeholder='Hut name' onChange={event => setName(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Province:</Form.Label>
                        <Form.Select id='province' required onChange={(e) => setProvince(parseInt(e.target.value))}>
                            <option value={0}>Select a provice</option>
                            {provinces.map(province => (
                                <option key={province.istat_provincia} value={province.istat_provincia}>{province.provincia}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>City:</Form.Label>
                        <Form.Select id='city' required onChange={(e) => setCity(parseInt(e.target.value))}>
                            <option value={0}>I want to leave this field empty</option>
                            {cities.filter(city => city.istat_provincia === province).map(city => (
                                <option key={city.codiceistatcomune} value={city.codiceistatcomune}>{city.comune}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Address:</Form.Label>
                        <Form.Control type='text' required onChange={event => setAddress(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Number of beds:</Form.Label>
                        <Form.Control type='number' min={1} step={1} required onChange={event => setBeds(event.target.value)} />
                    </Form.Group>
                    <Button variant='primary-light fw-bold' size='lg' type='submit' className='mb-3'>
                        Create new hike
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default HutForm;