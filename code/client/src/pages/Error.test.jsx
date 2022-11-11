import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import Error from './Error'

describe("Error page", () => {
    it("Page not found error correctly rendered", () => {
        render(<Error />, { wrapper: MemoryRouter })
        expect(screen.getByText("Page not found")).toBeInTheDocument();
    })

    it("A link to navigate to home is rendered and it works correctly", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Error />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", "/")
        userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe("/")
    })
})