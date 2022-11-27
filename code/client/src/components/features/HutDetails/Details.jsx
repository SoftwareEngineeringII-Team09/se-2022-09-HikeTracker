import { getLocationFullName } from '@lib/helpers/location'

const Details = ({ hut }) => {
    return (
        <div className=''>
            <div className='mb-5'>
                <h1 className='fw-black'>{hut.name}</h1>
                <span>{getLocationFullName(hut.province, hut.city)}</span>
            </div>
            <div className='d-flex flex-column flex-lg-row justify-content-between'>
                <div className='w-100 w-lg-50 px-lg-3'>
                    <h4 className='mb-3'>Useful info</h4>
                    <dl className='d-flex flex-column justify-content-between'>
                        {[
                            { label: "Altitude", value: `${hut.altitude} m` },
                            { label: "Cost per night", value: `${hut.cost} €` },
                            { label: "Number of beds", value: `${hut.beds}` },
                        ].map((info, idx) => (
                            <div key={idx} className='d-flex mb-2'>
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