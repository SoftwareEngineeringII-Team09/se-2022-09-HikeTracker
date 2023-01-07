import { Image } from 'react-bootstrap'

import { getLocationFullName } from '@lib/helpers/location'
import { SERVER_PORT } from '@services/config'

const Details = ({ hut }) => {
    return (
        <div className=''>
            <Image fluid src={`http://localhost:${SERVER_PORT}/${hut.hutImage}`} alt="Hut cover" className="rounded-3 mb-3" style={{ objectFit: 'cover' }} />
            <div className='mb-5'>
                <h1 className='fw-black'>{hut.hutName}</h1>
                <span>{getLocationFullName(hut.province, hut.city)}</span>
            </div>
            <div className='d-flex flex-column flex-lg-row justify-content-between'>
                <div className='w-100 w-lg-50 px-lg-3'>
                    <h4 className='mb-3'>Useful info</h4>
                    <dl className='d-flex flex-column justify-content-between'>
                        {[
                            { label: "Altitude", value: `${hut.altitude} m` },
                            { label: "Cost per night", value: `${hut.cost} €` },
                            { label: "Number of beds", value: `${hut.numOfBeds}` },
                        ].map((info, idx) => (
                            <div key={`info-${idx}`} className='d-flex mb-2'>
                                <dt className='me-2'>{info.label} |</dt>
                                <dd className='m-0'>{info.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}

export default Details