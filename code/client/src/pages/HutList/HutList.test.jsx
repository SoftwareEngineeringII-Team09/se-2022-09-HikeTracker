import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import Home from './Home'

describe("Home page", () => {
    it("Home page correctly rendered", () => {
        render(<Home />, { wrapper: MemoryRouter })
        expect(screen.getByText("Welcome to Hike Tracker")).toBeInTheDocument();
    })

    it("Home page renders a link to navigate to browse hikes route", () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Home />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", "/browse")
        userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe("/browse")
    })
})