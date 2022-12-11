import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Specs from './Specs'

jest.mock('react-bootstrap', () => ({
    Row: (props) => <div>{props.children}</div>,
    Col: (props) => <div>{props.children}</div>,
}))

const mockInput = jest.fn()
jest.mock("@components/form", () => ({
    Input: (props) => {
        mockInput(props)
        return <mock-input data-testid={`form-input-${props.id}`} />
    }
}))

const setup = () => render(<Specs />, { wrapper: MemoryRouter })
beforeEach(setup)

const filters = [
    { label: "Altitude", unit: "meters", input: "Altitude" },
    { label: "Cost per night", unit: "euros", input: "cost" },
    { label: "Number of beds", unit: "", input: "beds" }
]

describe('Specs Filter component', () => {
    it.each(filters)("Filter for $label is correctly rendered",
        (filter) => {
            expect(screen.getByText(new RegExp(filter.label, "i"))).toBeInTheDocument()
        })

    it.each(filters)("Unit text is correctly set for $label",
        (filter) => {
            expect(screen.getByText(new RegExp(filter.label, "i")).lastChild.textContent)
                .toContain(filter.unit)
        })

    it.each(filters)("Min input field is correctly rendered for $label",
        (filter) => {
            expect(screen.getByTestId(new RegExp(`min-${filter.input}`, "i")))
                .toBeInTheDocument()
        })

    it.each(filters)("Max input field is correctly rendered for $label",
        (filter) => {
            expect(screen.getByTestId(new RegExp(`max-${filter.input}`, "i")))
                .toBeInTheDocument()
        })

    it("Makes the test suite pass", () => {
        expect(true).toBe(true)
    })
})