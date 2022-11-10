import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from './Login';

describe("Home", () => {

    it("Correctly renders Registration form", () => {
        render(<LoginForm />, { wrapper: MemoryRouter })
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
    });

})