import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import TestFeature from './HikeCov'

describe("HutDetails.Details component", () => {

    it("Renders the correct content", () => {
        render(
            <MemoryRouter>
                <TestFeature />
            </MemoryRouter>
        )
        expect(screen.getByText("Test coverage title")).toBeInTheDocument()
        const button = screen.getByRole('button', { name: "Test coverage" });
        userEvent.click(button)
    })

})