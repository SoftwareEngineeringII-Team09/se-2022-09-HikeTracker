import { render, screen } from '@testing-library/react'

import Tooltip from './Tooltip'

jest.mock('react-bootstrap', () => ({
    Tooltip: ({ children }) => <span data-testid="tooltip-tip">{children}</span>,
    OverlayTrigger: ({ overlay, ...props }) => (
        <div data-testid="tooltip-overlay">
            {overlay}
            {props.children}
        </div>
    )
}))

const props = {
    tip: "tooltip shown"
}

beforeEach(() => {
    render(<Tooltip {...props}>This is a test</Tooltip>)
})

describe("Tooltip component", () => {
    it("Component is correctly rendered", () => {
        expect(screen.getByText(/this is a test/i)).toBeInTheDocument()
    })

    it("Overlay is correctly rendered", () => {
        expect(screen.getByTestId(/tooltip-overlay/i)).toBeInTheDocument()
    })

    it("Tip is correctly set", () => {
        expect(screen.getByTestId(/tooltip-tip/i).innerHTML).toBe("tooltip shown")
    })
})