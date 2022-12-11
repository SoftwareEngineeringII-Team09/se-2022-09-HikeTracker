import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import GeoArea from './GeoArea'

jest.mock('react-bootstrap', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}))

const mockLocation = jest.fn()
jest.mock('./Location', () => (props) => {
    mockLocation(props)
    return <mock-Location data-testid="location-filter" />
})

const mockPosition = jest.fn()
jest.mock('./Position', () => (props) => {
    mockPosition(props)
    return <mock-Position data-testid="position-filter" />
})

const filters = ["location", "position"]

const setup = () => render(<GeoArea />, { wrapper: MemoryRouter })

beforeEach(setup)

describe("GeoArea Filter components", () => {
    it("Component is correctly rendered", () => {
        expect(screen.getByText(/geographic area/i)).toBeInTheDocument()
    })

    it.each(filters)("Filter by %s is correctly rendered", (filter) => {
        expect(screen.getByTestId(new RegExp(`${filter}-filter`, "i"))).toBeInTheDocument()
    })

    it("Button that is able to open position filter is correctly rendered", () => {
        expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument()
    })
})