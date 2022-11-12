import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
const { createMemoryHistory } = require("history");
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import LoginForm from './Login';

describe("<LoginForm />", () => {

    let emailInput, passwordInput, submitButton, loginForm;
    let emailLabel, passwordLabel;

    const setup = async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <LoginForm />
            </Router>
        );
        loginForm = await screen.findByTestId("login");
        emailInput = await screen.findByLabelText("Email");
        emailLabel = await screen.findByText("Email");
        passwordInput = await screen.findByLabelText("Password");
        passwordLabel = await screen.findByText("Password");
        submitButton = await screen.findByRole("button");
    };

    /* Retrieve form fields */
    beforeEach(setup);

    it("Correctly renders Login form", () => {

        /* Email field */
        expect(emailLabel).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
        expect(emailInput).toHaveAttribute("placeholder", "Your email");

        /* Password field */
        expect(passwordLabel).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(passwordInput).toHaveAttribute("placeholder", "Your password");

        /* Submit button */
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveAttribute("type", "submit");

        /* Field values */
        expect(loginForm).toHaveFormValues({
            email: "",
            password: ""
        });
    });

    it("Requires email field", async () => {
        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);
        /* Wait for the error message to appear */
        await waitFor(async () => {
            const emailError = await screen.findByText("Insert your email address");
            expect(emailError).toBeInTheDocument();
            expect(emailError).toHaveClass("invalid-feedback");
        });
    });

    it("Requires password field", async () => {
        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);
        /* Wait for the error message to appear */
        await waitFor(async () => {
            const passwordError = await screen.findByText("Insert your password");
            expect(passwordError).toBeInTheDocument();
            expect(passwordError).toHaveClass("invalid-feedback");
        });
    });

    // it("Validates email field", async () => {

    //     expect(emailInput.value).toBe('');
    //     const invalidEmail = "invalid#email.com";

    //     // act(() => {
    //         /* Enter invalid email */
    //         await userEvent.type(emailInput, invalidEmail);

    //         /* Wait for the error message to appear */
    //         await waitFor(async () => {
    //             /* Check email value */
    //             expect(emailInput.value).toBe(invalidEmail);
    //             /* Check for error message */
    //             const emailError = await screen.findByText("This is not a valid email address");
    //             expect(emailInput).toHaveClass('is-invalid');
    //             expect(emailError).toBeInTheDocument();
    //         }, { interval: 100 });
    //     // });
    // });

    // it("Doesn't show error messages when input is valid", async () => {

    //     expect(emailInput.value).toBe('');
    //     expect(passwordInput.value).toBe('');

    //     const validEmail = "valid@email.com";
    //     const password = "p4ssw0rd";

    //     await act(async () => {
    //         /* Enter valid input */
    //         fireEvent.change(emailInput, { target: { value: validEmail } });
    //         fireEvent.change(passwordInput, { target: { value: password } });
    //         /* Unfocus the input to trigger form validation */
    //         fireEvent.focusOut(passwordInput);

    //         await waitFor(() => {
    //             /* Check data is inserted correctly and no error is shown */
    //             expect(emailInput.value).toBe(validEmail);
    //             expect(passwordInput.value).toBe(password);
    //             expect(emailInput).not.toHaveClass('is-invalid');
    //             expect(passwordInput).not.toHaveClass('is-invalid');
    //         });
    //     });
    // });

});