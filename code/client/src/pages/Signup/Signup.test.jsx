import { render, screen, waitFor } from '@testing-library/react'
const { createMemoryHistory } = require("history");
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { act } from 'react-dom/test-utils';
import Signup from './Signup'
import { signup } from '../../services/users';

describe("<Signup />", () => {

    let emailInput, passwordInput, submitButton, signupForm, roleInput, nameInput, surnameInput, mobileInput;
    let emailLabel, passwordLabel, nameLabel, surnameLabel, roleLabel, mobileLabel;

    const setup = async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Signup />
            </Router>
        );
        signupForm = await screen.findByTestId("signup");
        emailInput = await screen.findByLabelText("Email address");
        emailLabel = await screen.findByText("Email address");
        passwordInput = await screen.findByLabelText("Password");
        passwordLabel = await screen.findByText("Password");
        roleInput = await screen.findByLabelText("Who are you?");
        roleLabel = await screen.findByText("Who are you?");
        submitButton = await screen.findByRole("button");
    };

    /* Retrieve form fields */
    beforeEach(setup);

    it("Correctly renders Signup form", async () => {

        /* Email field */
        expect(emailLabel).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
        expect(emailInput).toHaveAttribute("placeholder", "Your email");

        /* Password field */
        expect(passwordLabel).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(passwordInput).toHaveAttribute("placeholder", "Your password");

        /* Role field */
        expect(roleLabel).toBeInTheDocument();

        /* Submit button */
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveAttribute("type", "submit");

        /* Field values */
        expect(signupForm).toHaveFormValues({
            email: "",
            password: "",
            role: "Hiker"
        });
    });

    it("Correctly renders Signup form requiring additional information", async () => {

        /* Email field */
        expect(emailLabel).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
        expect(emailInput).toHaveAttribute("placeholder", "Your email");

        /* Password field */
        expect(passwordLabel).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(passwordInput).toHaveAttribute("placeholder", "Your password");

        /* Role field */
        expect(roleLabel).toBeInTheDocument();

        /* Submit button */
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveAttribute("type", "submit");

        /* Field values */
        expect(signupForm).toHaveFormValues({
            email: "",
            password: "",
            role: "Hiker"
        });

        await userEvent.selectOptions(roleInput, "Hut Worker");

        nameInput = await screen.findByLabelText("Name");
        nameLabel = await screen.findByText("Name");
        surnameInput = await screen.findByLabelText("Surname");
        surnameLabel = await screen.findByText("Surname");
        mobileInput = await screen.findByLabelText("Mobile number");
        mobileLabel = await screen.findByText("Mobile number");

        // /* Name field */
        expect(nameLabel).toBeInTheDocument();
        expect(nameInput).toHaveAttribute("type", "text");
        expect(nameInput).toHaveAttribute("placeholder", "Your name");

        // /* Surname field */
        expect(surnameLabel).toBeInTheDocument();
        expect(surnameInput).toHaveAttribute("type", "text");
        expect(surnameInput).toHaveAttribute("placeholder", "Your surname");

        // /* Mobile field */
        expect(mobileLabel).toBeInTheDocument();
        expect(mobileInput).toHaveAttribute("type", "text");
        expect(mobileInput).toHaveAttribute("placeholder", "Your mobile number");

        /* Field values */
        expect(signupForm).toHaveFormValues({
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            mobile: "",
            role: "Hut Worker",
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

    it("Validates email field", async () => {

        expect(emailInput.value).toBe('');
        const invalidEmail = "invalid#email.com";

        // act(() => {
        /* Enter invalid email */
        await userEvent.type(emailInput, invalidEmail);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Wait for the error message to appear */
        await waitFor(async () => {
            /* Check email value */
            expect(emailInput.value).toBe(invalidEmail);
            /* Check for error message */
            const emailError = await screen.findByText("This is not a valid email address");
            expect(emailError).toBeInTheDocument();
            expect(emailInput).toHaveClass('is-invalid');
        });
        // });
    });

    it("Checks inserted password is strong", async () => {

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');

        const validEmail = "valid@email.com";
        const password = "p4ssw0rd";

        // await act(async () => {
        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(passwordInput, password);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        await waitFor(async () => {
            /* Check data is inserted correctly and no error is shown */
            expect(passwordInput.value).toBe(password);
            expect(passwordInput).toHaveClass('is-invalid');
            /* Check for error message */
            const passwordError = await screen.findByText("Please provide a password containing at least one lowercase letter, one uppercase letter, one number and one special character");
            expect(passwordError).toBeInTheDocument();
        });
        // });
    });
    
    it("Doesn't show error messages when input is valid", async () => {

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');

        const validEmail = "valid@email.com";
        const password = "Secure!p4ssw0rd";

        // await act(async () => {
        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(passwordInput, password);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        await waitFor(() => {
            /* Check data is inserted correctly and no error is shown */
            expect(emailInput.value).toBe(validEmail);
            expect(passwordInput.value).toBe(password);
            expect(emailInput).not.toHaveClass('is-invalid');
            expect(passwordInput).not.toHaveClass('is-invalid');
        });
        // });
    });

})