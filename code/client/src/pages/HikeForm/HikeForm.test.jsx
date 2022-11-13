import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import HikeForm from './HikeForm'

describe("Page for adding new hike", () => {
    it("Hike form page correctly rendered", () => {
        render(<HikeForm />, { wrapper: MemoryRouter })
        expect(screen.getByText("Insert hike data")).toBeInTheDocument();
    })

    it("Hike form page renders a form for inserting data of a new hike", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HikeForm />
            </Router>
        )
        
        userEvent.type(screen.getByLabelText("Title:"), 'My{space}title!')
        expect(screen.getByDisplayValue("My title!")).toBeInTheDocument()

        userEvent.type(screen.getByLabelText("Expected time:"), '0230')
        expect(screen.getByDisplayValue("02:30")).toBeInTheDocument()

        userEvent.type(screen.getByLabelText("Description:"), 'Prova!')
        expect(screen.getByDisplayValue("Prova!")).toBeInTheDocument()
    })
})