import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Signup from './Signup'

describe("Home", () => {

    it("Correctly renders Signup form", () => {
        render(<Signup />, { wrapper: MemoryRouter })
        expect(screen.getAllByText("Register")).toHaveLength(2);
        expect(screen.getByText("Who are you?")).toBeInTheDocument();
        expect(screen.getByText("Email address")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
    });

})