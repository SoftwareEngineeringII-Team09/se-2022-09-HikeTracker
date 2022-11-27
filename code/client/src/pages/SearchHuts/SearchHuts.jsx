import { useContext, useState, useEffect } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import { FaFilter } from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '@services/api'

import { filterHuts, isFilteredHutsArrayEmpty } from '@lib/helpers/filters'

import { FiltersProviderHuts, FiltersContextHuts } from '@contexts/FiltersContextHuts'
import { HutCard, HutsFilters } from '@components/features'

const SearchHuts = () => {
    const { filters, active } = useContext(FiltersContextHuts)

    const [huts, setHuts] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [openFilters, setOpenFilters] = useState(false)

    useEffect(() => {
        api.huts.getHuts()
            .then(res => setHuts(res))
            .catch(err => {
                setHuts([])
                toast.error(err.message, { theme: 'colored' })
            })
            .finally(() => setLoading(false))
    }, [])

    if (!loading)
        return (
            <div className='my-5'>
                <div className="d-flex justify-content-between w-100 align-items-center mb-5 bg-light">
                    <div>
                        <h1 className="fw-bold">Search huts</h1>
                        <p>See our amazing filters from the sidebar on the right</p>
                    </div>
                    <div>
                        <FaFilter role="button" size="28px" onClick={() => setOpenFilters(true)} />
                        <HutsFilters isOpen={openFilters} close={() => setOpenFilters(false)} />
                    </div>
                </div>

                <Row className='g-5 pt-3 pb-5'>
                    {isFilteredHutsArrayEmpty(huts, filters, active) ? <span className='fs-5'>No huts here...</span> :
                        filterHuts(huts, filters, active).map((hut, idx) => (
                            <HutCard key={idx} hut={hut} />
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
    <FiltersProviderHuts>
        <SearchHuts />
    </FiltersProviderHuts>
)

export default Wrapper