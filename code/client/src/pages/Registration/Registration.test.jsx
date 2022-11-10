import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Registration from './Registration'

describe("Home", () => {

    it("Correctly renders Registration form", () => {
        render(<Registration />, { wrapper: MemoryRouter })
        expect(screen.getByText("Register")).toBeInTheDocument();
        expect(screen.getByText("Who are you?")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
    });

})