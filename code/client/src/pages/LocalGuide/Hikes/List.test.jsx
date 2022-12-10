import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Router } from 'react-router-dom'
const { createMemoryHistory } = require("history");

import api from '@services/api'
import ListHikes from './List'

/* Mocking api and libraries */
jest.mock('@services/api');
jest.mock("axios");

describe("Hike list page", () => {
    it("Hike list page correctly rendered", () => {
        api.hikes.getHikesForLocalGuide.mockResolvedValueOnce([])
        render(<ListHikes />, { wrapper: MemoryRouter })
        waitFor(() => {
            expect(screen.getByText(/My Hikes/i)).toBeInTheDocument();
        })
    })

    it("Hike list page renders a link to navigate to form to add new hike", () => {
        api.hikes.getHikesForLocalGuide.mockResolvedValueOnce([])
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <ListHikes />
            </Router>
        )
        waitFor(async () => {
            expect(screen.getByRole("link", { name: /Create new hike/i })).toHaveAttribute("href", "/account/hikes/add")
            await userEvent.click(screen.getByRole("link", { name: /Create new hike/i }))
            expect(history.location.pathname).toBe("/account/hikes/add")
        })
    })
})