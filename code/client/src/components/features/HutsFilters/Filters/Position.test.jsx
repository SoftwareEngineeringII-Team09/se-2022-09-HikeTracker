import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Formik } from 'formik'

import Position from './Position'

jest.mock('react-bootstrap', () => {
    const Row = (props) => <div>{props.children}</div>
    const Col = (props) => <div>{props.children}</div>
    const Button = (props) => <button {...props}>{props.children}</button>

    const Modal = (props) => <div data-testid={`open-${props.show}`}>{props.children}</div>
    Modal.Header = (props) => <header>{props.children}</header>
    Modal.Title = (props) => <h1>{props.children}</h1>
    Modal.Body = (props) => <main>{props.children}</main>
    Modal.Footer = (props) => <footer>{props.children}</footer>

    return ({ Row, Col, Button, Modal })
})

jest.mock('react-leaflet', () => ({
    MapContainer: (props) => <div data-testid="map">{props.children}</div>,
    TileLayer: () => <span data-testid="tile-layer" />
}))

const mockInput = jest.fn()
jest.mock('@components/form', () => ({
    Input: (props) => {
        mockInput(props)
        return <mock-Input data-testid={`input-${props.id}`} />
    }
}))

const mockRadiusOnPoint = jest.fn()
jest.mock('@components/features/Map', () => ({
    RadiusOnPoint: (props) => {
        mockRadiusOnPoint(props)
        return <mock-RadiusOnPoint />
    }
}))

const props = {
    close: jest.fn()
}

const initialValues = {
    default: {
        geoArea: { position: { point: { lat: 50.2, lng: 50.2 }, radius: 0 } }
    },
    error: {
        geoArea: { position: { point: { lat: 0, lng: 0 }, radius: 0 } }
    }
}

const initialProps = {
    default: { initialValues: initialValues.default },
    error: { initialValues: initialValues.error },
}

const Wrapped = {
    open: () => (
        <Formik {...initialProps.default}>
            <Position isOpen={true} {...props} />
        </Formik>
    ),
    closed: () => (
        <Formik {...initialProps.default}>
            <Position isOpen={false} {...props} />
        </Formik>
    ),
    error: () => (
        <Formik {...initialProps.error}>
            <Position isOpen={true} {...props} />
        </Formik>
    )
}

const setup = {
    open: () => render(<Wrapped.open />, { wrapper: MemoryRouter }),
    closed: () => render(<Wrapped.closed />, { wrapper: MemoryRouter }),
    error: () => render(<Wrapped.error />, { wrapper: MemoryRouter })
}

describe('Position filter test', () => {
    it('Component is correctly rendered', () => {
        setup.open()
        expect(screen.getByText(/click a point/i)).toBeInTheDocument()
    })

    it('Map is correctly rendered if no geolocation errors occurs', () => {
        setup.open()
        expect(screen.getByTestId(/map/i)).toBeInTheDocument()
    })

    it('Confirm button is correctly rendered', () => {
        setup.open()
        expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
    })

    it('Close button is correctly rendered', () => {
        setup.open()
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('Modal is open when isOpen prop is true', () => {
        setup.open()
        expect(screen.queryByTestId(/open-true/i)).toBeInTheDocument()
        expect(screen.queryByTestId(/open-false/i)).not.toBeInTheDocument()
    })

    it('Modal is closed when isOpen prop is false', () => {
        setup.closed()
        expect(screen.queryByTestId(/open-false/i)).toBeInTheDocument()
        expect(screen.queryByTestId(/open-true/i)).not.toBeInTheDocument()
    })

    it('Function close is called when close button is clicked', async () => {
        setup.open()
        await userEvent.click(screen.getByRole('button', { name: /close/i }))
        expect(props.close).toHaveBeenCalledTimes(1)
    })

    it('Function close is called when confirm button is clicked', async () => {
        setup.open()
        await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
        expect(props.close).toHaveBeenCalledTimes(1)
    })
})

