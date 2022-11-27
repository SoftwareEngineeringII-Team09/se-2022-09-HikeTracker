import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import HutsFilters from './HutsFilters'

jest.mock('react-bootstrap', () => {
    const Offcanvas = (props) => <div>{props.children}</div>
    Offcanvas.Header = (props) => <div>{props.children}</div>
    Offcanvas.Title = (props) => <h1>{props.children}</h1>
    Offcanvas.Body = (props) => <div>{props.children}</div>

    return ({ Offcanvas })
})

const mockFiltersForm = jest.fn()
jest.mock('./FiltersForm', () => (props) => {
    mockFiltersForm(props)
    return <mock-FiltersForm data-testid="filters-form" />
})

const testProps = {
    isOpen: true,
    close: jest.fn()
}

const setup = () => render(<HutsFilters {...testProps} />, { wrapper: MemoryRouter })

beforeEach(setup)

describe("HutsFilters component", () => {

    it("Component is correctly rendered", () => {
        expect(screen.getByText(/Filters/i)).toBeInTheDocument()
    })

    it("Form is correctly rendered", () => {
        expect(screen.getByTestId(/filters-form/i)).toBeInTheDocument()
    })

    it("Filters are closed if close button is clicked", async () => {
        await userEvent.click(screen.getByTestId('close-button'))
        expect(testProps.close).toHaveBeenCalledTimes(1)
    })
})