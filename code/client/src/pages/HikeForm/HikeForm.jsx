import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '@services/api';
import { useNavigate } from "react-router-dom";

import provinces from '@data/locations/province'
import regions from '@data/locations/regioni'
import cities from '@data/locations/comuni'

const HikeForm = () => {
    const [title, setTitle] = useState('');
    const [province, setProvince] = useState(0);
    const [city, setCity] = useState(0);
    const [region, setRegion] = useState(0);
    const [expectedTime, setExpectedTime] = useState(0);
    const [difficulty, setDifficulty] = useState('Tourist');
    const [description, setDescription] = useState('');
    const [gpxFile, setGpxFile] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData();
        data.append('gpx', gpxFile);
        data.append('title', title);
        data.append('province', province);
        data.append('region', region);
        data.append('city', city);
        data.append('expectedTime', expectedTime);
        data.append('difficulty', difficulty);
        data.append('description', description);

        api.hikes.createHike(data)
            .then((res) => {
                // Success message
                toast.success("Hike created successfully", {
                    theme: "colored"
                });
                // Redirect to the newly created hike
                navigate('/browse/' + res.hikeId);
            })
            .catch((error) => {
                console.log(error)
                toast.error(error.message, {
                    theme: "colored",
                });
            });
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0])    
            setGpxFile(event.target.files[0]);
    };

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
                        <Form.Label htmlFor='region'>Region:</Form.Label>
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
                            {provinces
                            .filter(province => province.regione === region)
                            .map(province => (
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
                        <Form.Label htmlFor='expTime'>Expected time:</Form.Label>
                        <Form.Control id='expTime' required type='time' onChange={event => setExpectedTime(event.target.value)} />
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
                        <Form.Control id="description" required type='text-area' onChange={event => setDescription(event.target.value)} />
                    </Form.Group>
                    <Form.Group required className='mb-2'>
                        <Form.Label htmlFor='gpxFile'>Insert your gpx file:</Form.Label>
                        <Form.Control id="gpxFile" type='file' required onChange={handleFileChange} />
                    </Form.Group>
                    <Button variant='primary-light fw-bold my-3 mx-auto d-block' size='lg' type='submit' className='mb-3'>
                        Create new hike
                    </Button>
                </Form>
            </div>
        </>
    );
}

export default HikeForm;