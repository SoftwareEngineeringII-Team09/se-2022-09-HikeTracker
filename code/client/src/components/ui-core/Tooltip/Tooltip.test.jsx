import { render, screen } from '@testing-library/react'

import Tooltip from './Tooltip'

jest.mock('react-bootstrap', () => ({
    Tooltip: (props) => <span data-testid="tooltip-tip">{props.children}</span>,
    OverlayTrigger: ({ overlay, ...props }) => (
        <div placement={props.placement} data-testid="tooltip-overlay">
            {overlay}
            {props.children}
        </div>
    )
}))

const props = {
    placement: 'top',
    tip: 'Test tip',
}

const setup = () => render(<Tooltip {...props}>Hover me</Tooltip>)

beforeEach(() => setup())

describe("Tooltip component", () => {
    it('Component is correctly rendered', () => {
        expect(screen.getByText(/hover me/i)).toBeInTheDocument()
    })

    it('Placement is correctly set', () => {
        expect(screen.getByTestId(/tooltip-overlay/i)).toHaveAttribute('placement', props.placement)
    })

    it("Tip is correctly set", () => {
        expect(screen.getByTestId(/tooltip-tip/i).innerHTML).toBe(props.tip)
    })
})