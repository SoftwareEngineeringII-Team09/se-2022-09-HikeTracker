import { useState, createContext, useMemo } from 'react';

import { __DEFAULT_FILTERS, haveGeoAreaConflict } from '@lib/helpers/filters'
import { toast } from 'react-toastify';

export const FiltersContext = createContext({})

export const FiltersProvider = ({ children }) => {
    const [active, setActive] = useState(false)
    const [filters, setFilters] = useState(__DEFAULT_FILTERS)

    const handleApply = (filters) => {
        if (haveGeoAreaConflict(filters)) {
            toast.error('Just one between location and position can be set', { theme: 'colored' })
            return false
        }
        setFilters(filters)
        setActive(true)
        return true
    }

    const handleReset = () => {
        setFilters(__DEFAULT_FILTERS);
        setActive(false)
    }

    const ctx = useMemo(() => ({ filters: filters, active: active, apply: handleApply, reset: handleReset }), [active, filters]);

    return (
        <FiltersContext.Provider value={ctx}>
            {children}
        </FiltersContext.Provider>
    )
}