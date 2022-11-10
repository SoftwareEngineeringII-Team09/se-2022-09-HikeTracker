import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import bg from '../../assets/home_bg.jpg'

const Home = () => {
    return (
        <>
            <div>
                <img src={bg} alt="background" className='position-absolute top-0 start-0 p-0 w-100 h-100' style={{ objectFit: 'cover', objectPosition: "center bottom" }} />
                <div className='position-absolute w-100 h-100 top-0 start-0 bg-base-dark opacity-50' />
            </div>
            <div style={{ zIndex: 99 }} className="px-4">
                <div className='mb-5'>
                    <h1 className='text-white fw-black m-0 display-1'>Welcome to Hike Tracker</h1>
                    <p className='text-white fs-5'>The most powerful platform for hikers, local guides, hut managers and emergency operators</p>
                </div>
                <Link to="/browse">
                    <Button variant='primary-light fw-bold' size='lg'>
                        Let's browse hikes
                    </Button>
                </Link>
            </div>
        </>
    );
}

export default Home;