import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Difficulty from './Difficulty'

const mockCheck = jest.fn()
jest.mock("@components/form", () => ({
    Check: (props) => {
        mockCheck(props)
        return <mock-check data-testid={`form-check-${props.id}`} />
    }
}))

const difficulties = ["tourist", "hiker", "professional"]

const setup = () => render(<Difficulty />, { wrapper: MemoryRouter })
beforeEach(setup)

describe('Difficulty Filter component', () => {
    it("Component is correctly rendered", () => {
        expect(screen.getByText(/difficulty/i)).toBeInTheDocument()
    })

    it('Difficulty checkboxes are correctly rendered', () => {
        expect(screen.getAllByTestId(/form-check/i)).toHaveLength(3)
    })

    it.each(difficulties)('Checkbox for %s is correctly rendered',
        (difficulty) => {
            expect(screen.getByTestId(new RegExp(difficulty, "i"))).toBeInTheDocument()
        })
})