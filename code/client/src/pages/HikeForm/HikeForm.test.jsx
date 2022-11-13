import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import HikeForm from './HikeForm'

describe("Page for adding new hike", () => {
    it("Hike form page correctly rendered", () => {
        render(<HikeForm />, { wrapper: MemoryRouter })
        expect(screen.getByText("Insert Hike data")).toBeInTheDocument();
    })

    it("Hike form page renders a form for inserting data of a new hike", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Home />
            </Router>
        )
        expect(screen.getByLabelText("Title:")).toHaveAttribute("value", "")
        userEvent.type(screen.getByLabelText("Title:"), 'My{space}title!')
        expect(screen.getByLabelText("Title:").toHaveValue('My title!'))

        expect(screen.getByLabelText("Expected time:")).toHaveAttribute("value", "")
        userEvent.type(screen.getByLabelText("Expected time:"), '0230')
        expect(screen.getByLabelText("Expected time:").toHaveValue('02:30'))

        expect(screen.getByLabelText("Difficulty:")).toHaveAttribute("value", "Tourist")

        expect(screen.getByLabelText("Description:")).toHaveAttribute("value", "")
        userEvent.type(screen.getByLabelText("Description:"), 'Prova!')
        expect(screen.getByLabelText("Description:").toHaveValue('Prova!'))
    })
})