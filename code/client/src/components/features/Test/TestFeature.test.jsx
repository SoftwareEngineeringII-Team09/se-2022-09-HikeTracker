import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import TestFeature from './TestFeature'

describe("HutDetails.Details component", () => {

    it("Renders the correct content", () => {
        render(
            <MemoryRouter>
                <TestFeature />
            </MemoryRouter>
        )
        expect(screen.getByText("Test coverage")).toBeInTheDocument()
    })

})