import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '@services/api';
import Signup from './Signup';
import axios from 'axios';
import React from 'react';

/* Mocking the signup api and libraries */
jest.mock('@services/api');

jest.mock("axios");

jest.mock('react-toastify', () => {
    return {
        toast: {
            success: jest.fn(),
            error: jest.fn()
        }
    };
});

describe("<Signup />", () => {

    let emailInput, passwordInput, confirmPasswordInput, submitButton, signupForm, roleInput, nameInput, lastNameInput, mobileInput;
    let emailLabel, passwordLabel, confirmPasswordLabel, nameLabel, lastNameLabel, roleLabel, mobileLabel;

    const setup = async () => {
        const history = createMemoryHistory();
        render(
            <Router location={history.location} navigator={history}>
                <Signup />
            </Router>
        );
        signupForm = await screen.findByTestId("signup");
        emailInput = await screen.findByLabelText("Email");
        emailLabel = await screen.findByText("Email");
        passwordInput = await screen.findByLabelText("Password");
        passwordLabel = await screen.findByText("Password");
        confirmPasswordInput = await screen.findByLabelText("Confirm password");
        confirmPasswordLabel = await screen.findByText("Confirm password");
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
        expect(emailInput).toHaveAttribute("placeholder", "example@email.com");

        /* Password field */
        expect(passwordLabel).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(passwordInput).toHaveAttribute("placeholder", "••••••••••••");

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
        expect(emailInput).toHaveAttribute("placeholder", "example@email.com");

        /* Password field */
        expect(passwordLabel).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
        expect(passwordInput).toHaveAttribute("placeholder", "••••••••••••");

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

        nameInput = await screen.findByLabelText("First name");
        nameLabel = await screen.findByText("First name");
        lastNameInput = await screen.findByLabelText("Last name");
        lastNameLabel = await screen.findByText("Last name");
        mobileInput = await screen.findByLabelText("Mobile number");
        mobileLabel = await screen.findByText("Mobile number");

        /* Name field */
        expect(nameLabel).toBeInTheDocument();
        expect(nameInput).toHaveAttribute("type", "text");
        expect(nameInput).toHaveAttribute("placeholder", "Tony");

        /* lastName field */
        expect(lastNameLabel).toBeInTheDocument();
        expect(lastNameInput).toHaveAttribute("type", "text");
        expect(lastNameInput).toHaveAttribute("placeholder", "Stark");

        /* Mobile field */
        expect(mobileLabel).toBeInTheDocument();
        expect(mobileInput).toHaveAttribute("type", "tel");
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
            expect(emailError).toHaveClass("text-danger");
        });
    });

    it("Requires password field", async () => {
        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);
        /* Wait for the error message to appear */
        await waitFor(async () => {
            const passwordError = await screen.findByText("Insert your password");
            expect(passwordError).toBeInTheDocument();
            expect(passwordError).toHaveClass("text-danger");
        });
    });

    it("Validates email field", async () => {

        expect(emailInput.value).toBe('');
        const invalidEmail = "invalid#email.com";

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
    });

    it("Requires mobile field for certain roles", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");

        /* Get mobile field */
        mobileInput = await screen.findByLabelText("Mobile number");

        /* Write nothing in the mobile field */
        await userEvent.clear(mobileInput);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check mobile value */
        expect(mobileInput.value).toBe('');

        /* Wait for the error message to appear */
        const mobileError = await screen.findByText("Please provide your mobile number");
        expect(mobileError).toBeInTheDocument();
        expect(mobileInput).toHaveClass('is-invalid');
    });

    it("Validates mobile field", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");

        /* Get mobile field */
        mobileInput = await screen.findByLabelText("Mobile number");

        expect(mobileInput.value).toBe('');

        const invalidMobile = "invalidMobile";

        /* Enter invalid mobile */
        await userEvent.type(mobileInput, invalidMobile);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Wait for the error message to appear */
        await waitFor(async () => {
            /* Check mobile value */
            expect(mobileInput.value).toBe(invalidMobile);
            /* Check for error message */
            const mobileError = await screen.findByText("Provide a valid mobile number");
            expect(mobileError).toBeInTheDocument();
            expect(mobileInput).toHaveClass('is-invalid');
        });
    });

    it("Validates correct mobile field", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");

        /* Get mobile field */
        mobileInput = await screen.findByLabelText("Mobile number");

        expect(mobileInput.value).toBe('');

        const validMobile = "+39 3921234567";

        /* Enter invalid mobile */
        await userEvent.type(mobileInput, validMobile);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Wait for the error message to appear */
        await waitFor(async () => {
            /* Check mobile value */
            expect(mobileInput.value).toBe(validMobile);
            /* Check for error message */
            expect(mobileInput).not.toHaveClass('is-invalid');
        });
    });

    it("Requires first name and last name fields for certain roles", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");

        /* Get name/lastName fields */
        nameInput = await screen.findByLabelText("First name");
        lastNameInput = await screen.findByLabelText("Last name");

        /* Write nothing in the name/lastName fields */
        await userEvent.clear(nameInput);
        await userEvent.clear(lastNameInput);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check values */
        expect(nameInput.value).toBe('');
        expect(lastNameInput.value).toBe('');

        /* Wait for the error message to appear */
        const nameError = await screen.findByText("Please provide your first name");
        const lastNameError = await screen.findByText("Please provide your last name");
        expect(nameError).toBeInTheDocument();
        expect(nameInput).toHaveClass('is-invalid');
        expect(lastNameError).toBeInTheDocument();
        expect(lastNameInput).toHaveClass('is-invalid');
    });

    it("Requires first and last name to be not too long", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");
        const veryLongName = "This is a very long name that should not be accepted";

        /* Get name/lastName fields */
        nameInput = await screen.findByLabelText("First name");
        lastNameInput = await screen.findByLabelText("Last name");

        /* Write nothing in the name/lastName fields */
        await userEvent.type(nameInput, veryLongName);
        await userEvent.type(lastNameInput, veryLongName);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check values */
        expect(nameInput.value).toBe(veryLongName);
        expect(lastNameInput.value).toBe(veryLongName);

        /* Wait for the error message to appear */
        const nameError = await screen.findByText("First name must be 40 characters or less");
        const lastNameError = await screen.findByText("Last name must be 40 characters or less");
        expect(nameError).toBeInTheDocument();
        expect(nameInput).toHaveClass('is-invalid');
        expect(lastNameError).toBeInTheDocument();
        expect(lastNameInput).toHaveClass('is-invalid');
    });

    it("Doesn't show error messages when input is valid", async () => {

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
        expect(confirmPasswordInput.value).toBe('');

        const validEmail = "valid@email.com";
        const password = "Secure!p4ssw0rd";

        /* Mock signup api call */
        axios.post.mockResolvedValueOnce({});
        api.users.signup.mockResolvedValue(2);

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPasswordInput, password);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        await waitFor(() => {
            /* Check data is inserted correctly and no error is shown */
            expect(emailInput.value).toBe(validEmail);
            expect(passwordInput.value).toBe(password);
            expect(confirmPasswordInput.value).toBe(password);
            expect(emailInput).not.toHaveClass('is-invalid');
            expect(passwordInput).not.toHaveClass('is-invalid');
            expect(confirmPasswordInput).not.toHaveClass('is-invalid');
        });
    });

    /* INTEGRATION TESTS */

    it("Submits the form with correct data", async () => {

        const validEmail = "valid@email.com";
        const password = "Secure!p4ssw0rd";
        const mobile = "+39 3921234567";
        const role = "Hut Worker";
        const firstname = "John";
        const lastname = "Doe";

        /* Get additional fields */
        await userEvent.selectOptions(roleInput, role);
        nameInput = await screen.findByLabelText("First name");
        lastNameInput = await screen.findByLabelText("Last name");
        mobileInput = await screen.findByLabelText("Mobile number");

        /* Mock signup api call */
        axios.post.mockResolvedValueOnce({});
        api.users.signup.mockResolvedValueOnce(2);

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(nameInput, firstname);
        await userEvent.type(lastNameInput, lastname);
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPasswordInput, password);
        await userEvent.type(mobileInput, mobile);

        /* Check data is inserted correctly */
        expect(signupForm).toHaveFormValues({
            "email": validEmail,
            "firstname": firstname,
            "lastname": lastname,
            "mobile": mobile,
            "password": password,
            "confirmPassword": password,
            "role": role,
        });

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check no error is shown */
        await waitFor(() => {
            expect(roleInput).not.toHaveClass('is-invalid');
            expect(emailInput).not.toHaveClass('is-invalid');
            expect(passwordInput).not.toHaveClass('is-invalid');
            expect(confirmPasswordInput).not.toHaveClass('is-invalid');
            expect(nameInput).not.toHaveClass('is-invalid');
            expect(lastNameInput).not.toHaveClass('is-invalid');
            expect(mobileInput).not.toHaveClass('is-invalid');
        });

        /* Check api call is made */
        await waitFor(async () => {
            expect(api.users.signup).toHaveBeenCalledTimes(1);
            expect(api.users.signup).toHaveBeenCalledWith({
                email: validEmail,
                password: password,
                confirmPassword: password,
                firstname: firstname,
                lastname: lastname,
                mobile: mobile,
                role: role
            });
        });

        /* Check success message is shown */
        const successMessage1 = await screen.findByText("Welcome!");
        const successMessage2 = await screen.findByText("Your account has been created, we have sent you an email to activate your account. If you didn't receive it, please check your spam folder, or click the button below to resend it.");
        expect(successMessage1).toBeInTheDocument();
        expect(successMessage2).toBeInTheDocument();

    });

    it("Shows error toast on unsuccessful registration", async () => {

        const mockUnsuccessfulRegistrationMessage = "Sorry, there has been a problem with your registration, please try again later";
        const validEmail = "valid@email.com";
        const password = "Secure!p4ssw0rd";
        const mobile = "+39 3921234567";
        const role = "Hut Worker";
        const firstname = "John";
        const lastname = "Doe";

        /* Get additional fields */
        await userEvent.selectOptions(roleInput, role);
        nameInput = await screen.findByLabelText("First name");
        lastNameInput = await screen.findByLabelText("Last name");
        mobileInput = await screen.findByLabelText("Mobile number");

        /* Mock signup api call */
        api.users.signup.mockRejectedValue(mockUnsuccessfulRegistrationMessage);

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(nameInput, firstname);
        await userEvent.type(lastNameInput, lastname);
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPasswordInput, password);
        await userEvent.type(mobileInput, mobile);

        /* Check data is inserted correctly */
        expect(signupForm).toHaveFormValues({
            "email": validEmail,
            "firstname": firstname,
            "lastname": lastname,
            "mobile": mobile,
            "password": password,
            "confirmPassword": password,
            "role": role,
        });

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check no error is shown */
        await waitFor(() => {
            expect(roleInput).not.toHaveClass('is-invalid');
            expect(emailInput).not.toHaveClass('is-invalid');
            expect(passwordInput).not.toHaveClass('is-invalid');
            expect(confirmPasswordInput).not.toHaveClass('is-invalid');
            expect(nameInput).not.toHaveClass('is-invalid');
            expect(lastNameInput).not.toHaveClass('is-invalid');
            expect(mobileInput).not.toHaveClass('is-invalid');
        });

        /* Check api call is made */
        await waitFor(async () => {
            expect(api.users.signup).toHaveBeenCalledTimes(1);
            expect(api.users.signup).toHaveBeenCalledWith({
                email: validEmail,
                password: password,
                confirmPassword: password,
                firstname: firstname,
                lastname: lastname,
                mobile: mobile,
                role: role
            });
        });

        /* Check error message is shown */
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledTimes(1);
            expect(toast.error).toHaveBeenCalledWith(mockUnsuccessfulRegistrationMessage, { "theme": "colored" });
        });
    });

    it("Re-sends activation email", async () => {

        const validEmail = "valid@email.com";
        const password = "Secure!p4ssw0rd";
        const userId = 3;

        /* Mock signup/resend mail api call */
        axios.post.mockResolvedValueOnce({});
        axios.put.mockResolvedValueOnce({});
        api.users.signup.mockResolvedValueOnce(userId);
        api.users.sendVerificationCode.mockResolvedValueOnce({});

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(passwordInput, password);
        await userEvent.type(confirmPasswordInput, password);

        /* Check data is inserted correctly */
        expect(signupForm).toHaveFormValues({
            "email": validEmail,
            "password": password,
            "confirmPassword": password,
            "role": "Hiker"
        });

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check error message is shown */
        const resendActivationButton = await screen.findByText("Receive a new activation link");
        expect(resendActivationButton).toBeInTheDocument();

        /* Request new activation email */

        await userEvent.click(resendActivationButton);

        await waitFor(() => {
            /* Check api call is made */
            expect(api.users.sendVerificationCode).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("We have sent you a new activation email", { "theme": "colored" });
        });
    });

});

