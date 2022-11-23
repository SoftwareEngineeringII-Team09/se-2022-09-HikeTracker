import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import HikeList from './HikeList'

describe("Hike list page", () => {
    it("Hike list page correctly rendered", () => {
        render(<HikeList />, { wrapper: MemoryRouter })
        expect(screen.getByText("Your hikes:")).toBeInTheDocument();
    })

    it("Hike list page renders a link to navigate to form to add new hike", async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <HikeList />
            </Router>
        )
        expect(screen.getByRole("link")).toHaveAttribute("href", "/hikes/add")
        await userEvent.click(screen.getByRole("link"))
        expect(history.location.pathname).toBe("/hikes/add")
    })
})