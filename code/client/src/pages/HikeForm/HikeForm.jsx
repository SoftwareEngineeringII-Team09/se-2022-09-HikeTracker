import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import regions from '@data/locations/regioni'
import provinces from '@data/locations/province'
import cities from '@data/locations/comuni'

const HikeForm = () => {
    const [title, setTitle] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState(0);
    const [city, setCity] = useState(0);
    const [expectedTime, setExpectedTime] = useState(0);
    const [difficulty, setDifficulty] = useState('Tourist');
    const [description, setDescription] = useState('');
    const [referencePoints, setReferencePoints] = useState([]);
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
                        <Form.Label htmlFor='title'>Title:</Form.Label>
                        <Form.Control id='title' type='text' required placeholder='Hike title' onChange={event => setTitle(event.target.value)} />
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
                        <Form.Label htmlFor='difficulty'>Difficulty:</Form.Label>
                        <Form.Select id='difficulty' required onChange={event => setDifficulty(event.target.value)} >
                            <option>Tourist</option>
                            <option>Hiker</option>
                            <option>Professional hiker</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group required className='mb-2'>
                        <Form.Label htmlFor='description'>Description:</Form.Label>
                        <Form.Control id="description" type='text-area' onChange={event => setDescription(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor='refPoints'>Reference points:</Form.Label>
                        <Form.Control id="refPoints" type='text' />
                    </Form.Group>
                    <Form.Group required className='mb-2'>
                        <Form.Label htmlFor='gpxFile'>Insert your gpx file:</Form.Label>
                        <Form.Control id="gpxFIle" type='file'/>
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