import { useState } from "react"
import { Offcanvas, Button } from "react-bootstrap"
import { RiCloseLine } from 'react-icons/ri'

import GeoAreaFilter from './GeoAreaFilter'
import FilterRadioButton from "./FilterRadioButton"

import { helperFilters } from '@lib/helpers'

const HikesFilters = ({ filters, setFilters, isOpen, close }) => {
    const [province, setProvince] = useState(0)
    const [city, setCity] = useState(0)
    const [activeFilters, setActiveFilters] = useState(filters)

    const handleFilter = (isActived, category, filter) => {
        const res = { ...activeFilters }
        if (isActived)
            res[category] = res[category].filter((item => item !== filter))
        else res[category].push(filter)
        setActiveFilters(res)
    }

    const handleApply = () => {
        const location = { province, city }
        setFilters({ ...activeFilters, location, active: true })
        close()
    }

    const handleReset = () => {
        const reset = {
            ...helperFilters.defaultFilters,
            active: false
        }
        setFilters(reset)
        setActiveFilters(reset)
        setProvince(0)
        setCity(0)
        close()
    }

    return (
        <Offcanvas show={isOpen} onHide={close} placement="end" className="bg-light text-primary-dark" style={{ width: "100%" }}>
            <Offcanvas.Header className="px-4 container">
                <Offcanvas.Title className="fs-2 fw-bold">Filters</Offcanvas.Title>
                <RiCloseLine data-testid="close-button" style={{ width: 32, height: 32 }} onClick={close} />
            </Offcanvas.Header>
            <Offcanvas.Body className="px-4 d-flex flex-column justify-content-between container">
                <div>
                    <GeoAreaFilter location={{ province, city }} setProvince={setProvince} setCity={setCity} />
                    {helperFilters.filtersKeys.map((category, idx_category) => (
                        <div key={idx_category} className="d-flex flex-column align-items-start mb-3">
                            <h4 className="mb-3">{helperFilters.getFilterName(category)}</h4>
                            <div className="d-flex flex-wrap">
                                {helperFilters.getFilterValues(category).map((filter, idx) => {
                                    const active = activeFilters[category].includes(filter)
                                    return (
                                        <FilterRadioButton key={idx} active={active} onClick={() => handleFilter(active, category, filter)}>
                                            {helperFilters.getFilterLabel(category, filter)}
                                        </FilterRadioButton>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="d-flex my-4">
                    <Button variant="base" size="lg" className="fw-bold w-100 py-3 me-3" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button variant="primary-dark" size="lg" className="fw-bold w-100 py-3" onClick={handleApply}>
                        Apply
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas >
    )
}

export default HikesFilters