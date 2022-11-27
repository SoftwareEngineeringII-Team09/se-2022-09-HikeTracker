import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import bg from '@assets/home_bg.jpg';

const HutList = () => {
    return (
        <>
            <div>
                <img src={bg} alt="background" className='position-absolute top-0 start-0 p-0 w-100 h-100' style={{ objectFit: 'cover', objectPosition: "center bottom" }} />
                <div className='position-absolute w-100 h-100 top-0 start-0 bg-base-dark opacity-50' />
            </div>
            <div style={{ zIndex: 99 }} className="px-4">
                <div className='mb-5'>
                    <h1 className='text-white fw-black m-0 display-1'>Your huts:</h1>
                </div>
                <div className='mb-2 p-2 bg-light d-flex justify-content-between rounded'>
                    <h2>My hut #1</h2>
                    <Button>Update</Button>
                </div>
                <Link to="/huts/add">
                    <Button variant='primary-light fw-bold' size='lg'>
                        New hut
                    </Button>
                </Link>
            </div>
        </>
    );
}

export default HutList;