import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import HutForm from './HutForm'

describe("Hut form page", () => {
    it("Hut form page correctly rendered", () => {
        render(<HutForm />, { wrapper: MemoryRouter })
        expect(screen.getByText("Insert hut data")).toBeInTheDocument();
    })

    it("Hut form page renders a form for inserting data of a new hut", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HutForm />
            </Router>
        )

        expect(screen.getByLabelText("Name:")).toHaveAttribute("value", "")
        userEvent.type(screen.getByLabelText("Name:"), 'Rifugio1')
        expect(screen.getByLabelText("Name:").toHaveValue('Rifugio1'))

        expect(screen.getByLabelText("Address:")).toHaveAttribute("value", "")
        userEvent.type(screen.getByLabelText("Address:"), 'Via{space}Roma{space}1')
        expect(screen.getByLabelText("Address:").toHaveValue('Via Roma 1'))

        expect(screen.getByLabelText("Number of beds:")).toHaveAttribute("value", "")
        userEvent.type(screen.getByLabelText("Number of beds:"), '25')
        expect(screen.getByLabelText("Number of beds:").toHaveValue('25'))
    })
})