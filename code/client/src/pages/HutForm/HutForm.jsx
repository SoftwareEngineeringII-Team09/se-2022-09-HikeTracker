import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const HutForm = () => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [beds, setBeds] = useState(0);
    const [price, setPrice] = useState(0);
    const [openHour, setOpenHour] = useState(0);
    const [closeHour, setCloseHour] = useState(0);
    const [openDays, setOpenDays] = useState([]);

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
                        <Form.Control type='text' placeholder='Hut name' onChange={event => setName(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Position:</Form.Label>
                        <Form.Control type='text' onChange={event => setPosition(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Number of beds:</Form.Label>
                        <Form.Control type='number' min={1} step={1} onChange={event => setBeds(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Price per night:</Form.Label>
                        <Form.Control type='number' min={0.01} step={0.01} onChange={event => setPrice(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Open hour:</Form.Label>
                        <Form.Control type='time' onChange={event => setOpenHour(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Close hour:</Form.Label>
                        <Form.Control type='time' onChange={event => setCloseHour(event.target.value)} />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Open days:</Form.Label>
                        <Form.Check type='checkbox' label='Monday' onChange={event => {event.target.checked ? openDays.push('Monday') : setOpenDays(openDays => openDays.filter(e => e !== 'Monday'))}} />
                        <Form.Check type='checkbox' label='Tuesday' onChange={event => {event.target.checked ? openDays.push('Tuesday') : setOpenDays(openDays => openDays.filter(e => e !== 'Tuesday'))}} />
                        <Form.Check type='checkbox' label='Wednesday' onChange={event => {event.target.checked ? openDays.push('Wednesday') : setOpenDays(openDays => openDays.filter(e => e !== 'Wednesday'))}} />
                        <Form.Check type='checkbox' label='Thursday' onChange={event => {event.target.checked ? openDays.push('Thursday') : setOpenDays(openDays => openDays.filter(e => e !== 'Thursday'))}} />
                        <Form.Check type='checkbox' label='Friday' onChange={event => {event.target.checked ? openDays.push('Friday') : setOpenDays(openDays => openDays.filter(e => e !== 'Friday'))}} />
                        <Form.Check type='checkbox' label='Saturday' onChange={event => {event.target.checked ? openDays.push('Saturday') : setOpenDays(openDays => openDays.filter(e => e !== 'Saturday'))}} />
                        <Form.Check type='checkbox' label='Sunday' onChange={event => {event.target.checked ? openDays.push('Sunday') : setOpenDays(openDays => openDays.filter(e => e !== 'Sunday'))}} />
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