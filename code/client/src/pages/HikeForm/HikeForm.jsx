import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import provinces from '@data/provinces'
import cities from '@data/cities'

const HikeForm = () => {
    const [title, setTitle] = useState('');
    const [province, setProvince] = useState(0);
    const [city, setCity] = useState(0);
    const [expectedTime, setExpectedTime] = useState(0);
    const [ascent, setAscent] = useState(0);
    const [difficulty, setDifficulty] = useState('Tourist');
    const [description, setDescription] = useState('');
    const [referencePoints, setReferencePoints] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <>
            <div style={{ zIndex: 99 }} className="px-4">
                <div className='mb-5'>
                    <h1 className='fw-black m-0 display-1'>Insert hike data</h1>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type='text' placeholder='Hike title' onChange={event => setTitle(event.target.value)} />
                    </Form.Group>
                    <Form.Select onChange={(e) => setProvince(parseInt(e.target.value))} className="p-3 border-0 bg-base-light">
                        <option value={0}>Select a provice</option>
                        {provinces.map(province => (
                            <option key={province.istat_provincia} value={province.istat_provincia}>{province.provincia}</option>
                        ))}
                    </Form.Select>
                    <Form.Select onChange={(e) => setCity(parseInt(e.target.value))} className="p-3 border-0 bg-base-light">
                        <option value={0}>I want to leave this field empty</option>
                        {cities.filter(city => city.istat_provincia === province).map(city => (
                            <option key={city.codiceistatcomune} value={city.codiceistatcomune}>{city.comune}</option>
                        ))}
                    </Form.Select>
                    <Form.Group className='mb-2'>
                        <Form.Label>Expected time:</Form.Label>
                        <Form.Control type='time' onChange={event => setExpectedTime(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Ascent:</Form.Label>
                        <Form.Control type='number' min={0} max={5000} step={1} onChange={event => setAscent(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Difficulty:</Form.Label>
                        <Form.Select onChange={event => setDifficulty(event.target.value)} >
                            <option>Tourist</option>
                            <option>Hiker</option>
                            <option>Master</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control type='text-area' onChange={event => setDescription(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Reference points:</Form.Label>
                        <Form.Control type='text' onChange={event => setReferencePoints(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Insert your gpx file:</Form.Label>
                        <Form.Control type='file'/>
                    </Form.Group>
                    <Button variant='primary-light fw-bold' size='lg' type='submit' className='mb-3'>
                        Create new hike
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default HikeForm;