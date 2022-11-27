import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { FiltersProvider } from "@contexts/FiltersContext"
import FiltersForm from './FiltersForm'

jest.mock('react-bootstrap', () => ({
    Button: (props) => <button {...props}>{props.children}</button>
}))

const mockFilters = {
    GeoArea: jest.fn(),
    Difficulty: jest.fn(),
    Specs: jest.fn(),
}
jest.mock('./Filters', () => ({
    GeoArea: () => {
        mockFilters.GeoArea()
        return <mock-GeoAreaFilter data-testid="geoArea-filter" />
    },
    Difficulty: () => {
        mockFilters.Difficulty()
        return <mock-DifficultyFilter data-testid="difficulty-filter" />
    },
    Specs: () => {
        mockFilters.Specs()
        return <mock-SpecFilter data-testid="specs-filter" />
    }
}))

const props = {
    onSubmit: jest.fn(),
    onReset: jest.fn()
}

const setup = () => render(
    <FiltersProvider>
        <FiltersForm {...props} />
    </FiltersProvider>, { wrapper: MemoryRouter }
)
beforeEach(setup)

const filters = [
    { label: "GeoAreaFilter", testid: "geoArea-filter" },
    { label: "DifficultyFilter", testid: "difficulty-filter" },
    { label: "SpecsFilter", testid: "specs-filter" }
]

describe('FilterForm component', () => {
    it.each(filters)('$label component is correctly rendered',
        (filter) => {
            expect(screen.getByTestId(filter.testid)).toBeInTheDocument()
        })

    it('Submit button is correctly rendered', () => {
        expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument()
    })

    it('Reset button is correctly rendered', () => {
        expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    })

    it('Reset function is called when reset button is clicked', async () => {
        await userEvent.click(screen.getByRole('button', { name: /reset/i }))
        expect(props.onReset).toHaveBeenCalledTimes(1)
    })

    it('Submit function is called when submit button is clicked', async () => {
        await userEvent.click(screen.getByRole('button', { name: /apply/i }))
        expect(props.onSubmit).toHaveBeenCalledTimes(1)
    })
})