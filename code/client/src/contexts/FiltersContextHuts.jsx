import { useState, createContext, useMemo } from 'react';

import { __DEFAULT_FILTERS_HUTS, haveGeoAreaConflict } from '@lib/helpers/filters'
import { toast } from 'react-toastify';

export const FiltersContextHuts = createContext({})

export const FiltersProviderHuts = ({ children }) => {
    const [active, setActive] = useState(false)
    const [filters, setFilters] = useState(__DEFAULT_FILTERS_HUTS)

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
        setFilters(__DEFAULT_FILTERS_HUTS);
        setActive(false)
    }

    const ctx = useMemo(() => ({ filters: filters, active: active, apply: handleApply, reset: handleReset }), [active, filters]);

    return (
        <FiltersContextHuts.Provider value={ctx}>
            {children}
        </FiltersContextHuts.Provider>
    )
}