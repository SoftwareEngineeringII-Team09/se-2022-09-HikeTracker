import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Router } from 'react-router-dom'

import api from '@services/api'
import CompletedHikes from './CompletedHikes'

/* Mocking api and libraries */
jest.mock('@services/api');
jest.mock("axios");

describe("Completed hikes page", () => {
    it("Completed hike page correctly rendered", () => {
        api.hikes.getCompletedHikes.mockResolvedValueOnce([])
        render(<CompletedHikes />, { wrapper: MemoryRouter })
        waitFor(() => {
            expect(screen.getByText(/Completed hikes/i)).toBeInTheDocument();
        })
    })
})