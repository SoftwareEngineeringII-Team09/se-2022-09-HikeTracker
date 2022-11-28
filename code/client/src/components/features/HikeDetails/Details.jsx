import { getLocationFullName } from '@lib/helpers/location'

const Details = ({ hike }) => {
    return (
        <div className=''>
            <div className='mb-5'>
                <h1 className='fw-black'>{hike.title}</h1>
                <h5 className='mb-2'>
                    Created by <span className='fw-bold'>{hike.writer}</span>{" "}
                    for <span className='fw-bold bg-primary-light px-3 fs-6 py-1 rounded-pill'>{hike.difficulty}</span>
                </h5>
                <span>{getLocationFullName(hike.province, hike.city)}</span>
            </div>
            <p>{hike.description}</p>
            <div className='mt-5 d-flex flex-column flex-lg-row justify-content-between'>
                {[
                    { label: "Start", ...hike.startPoint },
                    { label: "End", ...hike.endPoint }
                ].map((point, idx) => (
                    <div key={idx} className="mb-5 w-100 w-lg-50 px-lg-3">
                        <h4 className='me-2 m-0'>{point.label} point</h4>
                        <p className='m-0'>{point.name}</p>
                    </div>
                ))}
            </div>
            <div className='d-flex flex-column flex-lg-row justify-content-between'>
                <div className='w-100 w-lg-50 mb-5 px-lg-3'>
                    <h4>Reference points</h4>
                    <div className='d-flex flex-column'>
                        {hike.referencePoints.map((point, idx) => (
                            <span key={idx} className='m-0'>{point.name}</span>
                        ))}
                    </div>
                </div>
                <div className='w-100 w-lg-50 px-lg-3'>
                    <h4 className='mb-3'>Useful info</h4>
                    <dl className='d-flex flex-column justify-content-between'>
                        {[
                            { label: "Elevation", value: `${hike.maxElevation} m` },
                            { label: "Length", value: `${hike.length} km` },
                            { label: "Ascent", value: `${hike.ascent} m` },
                            { label: "Expected RT time", value: `${hike.expectedTime.hours}h : ${hike.expectedTime.minutes}m` },
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