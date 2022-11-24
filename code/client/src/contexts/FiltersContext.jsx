import { useState, createContext } from 'react';

import { __DEFAULT_FILTERS, haveGeoAreaConflict } from '@lib/helpers/filters'
import { toast } from 'react-toastify';

export const FiltersContext = createContext({})

export const FiltersProvider = ({ children }) => {
    const [active, setActive] = useState(false)
    const [filters, setFilters] = useState(__DEFAULT_FILTERS)

    const handleApply = (filters) => {
        if (haveGeoAreaConflict(filters))
            toast.error('Just one between location and position can be set', { theme: 'colored' })
        else {
            setFilters(filters)
            setActive(true)
        }
    }

    const handleReset = () => {
        setFilters(__DEFAULT_FILTERS);
        setActive(false)
    }

    const ctx = { filters: filters, active: active, apply: handleApply, reset: handleReset }

    return (
        <FiltersContext.Provider value={ctx}>
            {children}
        </FiltersContext.Provider>
    )
}