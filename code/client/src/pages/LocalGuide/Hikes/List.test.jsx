import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import ListHikes from './List'

describe("Hike list page", () => {
    it("Hike list page correctly rendered", () => {
        render(<ListHikes />, { wrapper: MemoryRouter })
        expect(screen.getByText(/My Hikes/i)).toBeInTheDocument();
    })

    it("Hike list page renders a link to navigate to form to add new hike", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <ListHikes />
            </Router>
        )
        expect(screen.getByRole("link", {name: /Create new hike/i})).toHaveAttribute("href", "/account/hikes/add")
        await userEvent.click(screen.getByRole("link", {name: /Create new hike/i}))
        expect(history.location.pathname).toBe("/account/hikes/add")
    })
})