import { useContext } from "react"
import { Offcanvas } from "react-bootstrap"
import { RiCloseLine } from 'react-icons/ri'

import { FiltersContext } from "@contexts/FiltersContext"
import FiltersForm from "./FiltersForm"

const HutsFilters = ({ isOpen, close }) => {
    const { apply, reset } = useContext(FiltersContext)

    const handleSubmit = (filters) => {
        if (apply(filters))
            close()
    }

    const handleReset = () => {
        reset()
        close()
    }

    return (
        <Offcanvas show={isOpen} onHide={close} placement="end" className="bg-light text-primary-dark" style={{ width: "100%" }}>
            <Offcanvas.Header className="px-4 container">
                <Offcanvas.Title className="fs-2 fw-bold">Filters</Offcanvas.Title>
                <RiCloseLine data-testid="close-button" style={{ width: 32, height: 32 }} onClick={close} />
            </Offcanvas.Header>
            <Offcanvas.Body className="px-4 d-flex flex-column justify-content-between container">
                <FiltersForm onSubmit={handleSubmit} onReset={handleReset} />
            </Offcanvas.Body>
        </Offcanvas >
    )
}

export default HutsFilters