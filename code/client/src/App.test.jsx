import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import App from './App'

describe("App Routing", () => {
    it("From homepage to browse hikes", () => {
        render(<App />, { wrapper: MemoryRouter })
    
        expect(screen.getByText("Welcome to Hike Tracker")).toBeInTheDocument();
        
        const links = screen.getAllByRole("link").filter(link => link.getAttribute("href") === "/browse")
        userEvent.click(links[0]);
    
        expect(screen.getByText("Browse hikes")).toBeInTheDocument();
    })

    it("From homepage to login", () => {
        render(<App />, { wrapper: MemoryRouter })
    
        expect(screen.getByText("Welcome to Hike Tracker")).toBeInTheDocument();
        
        const links = screen.getAllByRole("link").filter(link => link.getAttribute("href") === "/login")
        userEvent.click(links[0]);
    
        expect(screen.getByText("Login")).toBeInTheDocument();
    })

    it("From homepage to signup", () => {
        render(<App />, { wrapper: MemoryRouter })
    
        expect(screen.getByText("Welcome to Hike Tracker")).toBeInTheDocument();
        
        const links = screen.getAllByRole("link").filter(link => link.getAttribute("href") === "/signup")
        userEvent.click(links[0]);
    
        expect(screen.getByText("Signup")).toBeInTheDocument();
    })
})