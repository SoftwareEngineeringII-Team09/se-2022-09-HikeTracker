import { useContext, useState, useEffect } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import { FaFilter } from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '@services/api'

import { filterHikes, isFilteredHikesArrayEmpty } from '@lib/helpers/filters'

import { FiltersProvider, FiltersContext } from '@contexts/FiltersContext'
import { HikeCard, HikesFilters } from '@components/features'

const BrowseHikes = () => {
    const { filters, active } = useContext(FiltersContext)

    const [hikes, setHikes] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [openFilters, setOpenFilters] = useState(false)

    useEffect(() => {
        api.hikes.getHikes()
            .then(hikes => setHikes(hikes))
            .catch(err => {
                toast.error(err, { theme: 'colored' })
                setHikes([])
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
                        <HikesFilters isOpen={openFilters} close={() => setOpenFilters(false)} />
                    </div>
                </div>

                <Row className='g-5 pt-3 pb-5'>
                    {isFilteredHikesArrayEmpty(hikes, filters, active) ? <span className='fs-5'>No hikes here...</span> :
                        filterHikes(hikes, filters, active).map((hike, idx) => (
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

const Wrapper = () => (
    <FiltersProvider>
        <BrowseHikes />
    </FiltersProvider>
)

export default Wrapper