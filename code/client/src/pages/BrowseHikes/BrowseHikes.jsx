import { useState, useEffect } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { FaFilter } from 'react-icons/fa'

import api from '@services/api'

import { helperFilters } from '@lib/helpers'
import { HikeCard, HikesFilters } from '@components/features'

const BrowseHikes = () => {
    const [hikes, setHikes] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [openFilters, setOpenFilters] = useState(false)
    const [filters, setFilters] = useState({
        active: false,
        ...helperFilters.defaultFilters
    })

    useEffect(() => {
        api.hikes.getHikes()
            .then(res => setHikes(res.hikes))
            .catch(err => {
                setHikes([])
                toast.error(err.message, {theme: 'colored'})
            })
            .finally(() => setLoading(false))
    }, [])

    if (!loading)
        return (
            <div className='my-5'>
                <div className="d-flex justify-content-between w-100 align-items-center mb-5 bg-light">
                    <div>
                        <h1 className="fw-bold">Browse hikes</h1>
                        <p>See our amazing filters from the sidebar on the right</p>
                    </div>
                    <div>
                        <FaFilter role="button" size="28px" onClick={() => setOpenFilters(true)} />
                        <HikesFilters filters={filters} setFilters={setFilters} isOpen={openFilters} close={() => setOpenFilters(false)} />
                    </div>
                </div>

                <Row className='g-4 pt-3 pb-5'>
                    {!helperFilters.filterHikes(hikes, filters).length ? <span className='fs-5'>No hikes here...</span> :
                        helperFilters.filterHikes(hikes, filters).map((hike, idx) => (
                            <HikeCard key={idx} hike={hike} />
                        ))}
                </Row >
            </div>
        )
    else return (
        <div role="status" className='h-100vh position-absolute top-50 start-50'>
            <Spinner animation="border" variant="primary-dark" />
        </div>
    )
}

export default BrowseHikes