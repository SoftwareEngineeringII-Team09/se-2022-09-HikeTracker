import { useState, useCallback } from "react"
import { Button } from "react-bootstrap"
import { FaMapMarkedAlt } from 'react-icons/fa'

import Location from "./Location"
import Position from "./Position"

const GeoArea = () => {
    const [openMap, setOpenMap] = useState(false)

    const handleCloseMap = useCallback(() => setOpenMap(false), [])
    const handleOpenMap = useCallback(() => setOpenMap(true), [])

    return (
        <div className="mb-5">
            <h4 className="fw-bold mb-3">Geographic area</h4>
            <Location />
            <Position isOpen={openMap} close={handleCloseMap} />
            <Button variant="link text-primary text-decoration-none p-0 d-flex align-items-end"
                onClick={handleOpenMap}>
                <FaMapMarkedAlt size="32" className="me-2" />
                Click to open the map and select a radius
            </Button>
        </div>
    )
}

export default GeoArea