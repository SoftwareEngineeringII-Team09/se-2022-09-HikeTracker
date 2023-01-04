import { render, screen } from '@testing-library/react';
import LoadingButton from './LoadingButton';

jest.mock('react-bootstrap', () => {
    const Spinner = ({ children, ...props }) => <div {...props} data-testid="test-spinner">{children}</div>
    const Button = ({ children, ...props }) => <button {...props}>{children}</button>
    return ({ Button, Spinner })
})


describe("<LoadingButton />", () => {
    
    const buttonText = "Test Button";

    it("Correctly renders loading button", () => {
        render(<LoadingButton text={buttonText} type="submit" loading={false} />)
        const button = screen.getByRole("button", { name: buttonText });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("type", "submit");
        expect(button).not.toHaveAttribute("disabled");
    })

    it("Disables button if loading is true", () => {
        render(<LoadingButton text={buttonText} type="submit" loading={true} />)
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("disabled");
    })

    it("Shows spinner if loading is true", () => {
        render(<LoadingButton text={buttonText} type="submit" loading={true} />)
        expect(screen.getByTestId("test-spinner")).toBeInTheDocument();
    })

})