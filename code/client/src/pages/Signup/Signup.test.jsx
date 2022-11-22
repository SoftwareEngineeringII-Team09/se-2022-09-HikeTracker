import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '../../services/api';
import Signup from './Signup';
import axios from 'axios';
import React from 'react';


/* Mocking the signup api and libraries */
jest.mock('../../services/api');

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

        /* Name field */
        expect(nameLabel).toBeInTheDocument();
        expect(nameInput).toHaveAttribute("type", "text");
        expect(nameInput).toHaveAttribute("placeholder", "Your name");

        /* Surname field */
        expect(surnameLabel).toBeInTheDocument();
        expect(surnameInput).toHaveAttribute("type", "text");
        expect(surnameInput).toHaveAttribute("placeholder", "Your surname");

        /* Mobile field */
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

    it("Requires name and surname fields for certain roles", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");

        /* Get name/surname fields */
        nameInput = await screen.findByLabelText("Name");
        surnameInput = await screen.findByLabelText("Surname");

        /* Write nothing in the name/surname fields */
        await userEvent.clear(nameInput);
        await userEvent.clear(surnameInput);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check values */
        expect(nameInput.value).toBe('');
        expect(surnameInput.value).toBe('');

        /* Wait for the error message to appear */
        const nameError = await screen.findByText("Please provide your name");
        const surnameError = await screen.findByText("Please provide your surname");
        expect(nameError).toBeInTheDocument();
        expect(nameInput).toHaveClass('is-invalid');
        expect(surnameError).toBeInTheDocument();
        expect(surnameInput).toHaveClass('is-invalid');
    });

    it("Requires name and surname to be not too long", async () => {

        await userEvent.selectOptions(roleInput, "Hut Worker");
        const veryLongName = "This is a very long name that should not be accepted";

        /* Get name/surname fields */
        nameInput = await screen.findByLabelText("Name");
        surnameInput = await screen.findByLabelText("Surname");

        /* Write nothing in the name/surname fields */
        await userEvent.type(nameInput, veryLongName);
        await userEvent.type(surnameInput, veryLongName);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check values */
        expect(nameInput.value).toBe(veryLongName);
        expect(surnameInput.value).toBe(veryLongName);

        /* Wait for the error message to appear */
        const nameError = await screen.findByText("First name must be 40 characters or less");
        const surnameError = await screen.findByText("Last name must be 40 characters or less");
        expect(nameError).toBeInTheDocument();
        expect(nameInput).toHaveClass('is-invalid');
        expect(surnameError).toBeInTheDocument();
        expect(surnameInput).toHaveClass('is-invalid');
    });

    it("Checks inserted password is strong", async () => {

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');

        const validEmail = "valid@email.com";
        const password = "p4ssw0rd";

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(passwordInput, password);

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        await waitFor(async () => {
            /* Check data is inserted correctly and no error is shown */
            expect(passwordInput).toHaveClass('is-invalid');
            expect(passwordInput.value).toBe(password);
        });

        /* Check for error message */
        const passwordError = await screen.findByText("Please provide a password containing at least one lowercase letter, one uppercase letter, one number and one special character");
        expect(passwordError).toBeInTheDocument();
    });

    it("Doesn't show error messages when input is valid", async () => {

        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');

        const validEmail = "valid@email.com";
        const password = "Secure!p4ssw0rd";

        /* Mock signup api call */
        api.users.signup.mockResolvedValue({});

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
        nameInput = await screen.findByLabelText("Name");
        surnameInput = await screen.findByLabelText("Surname");
        mobileInput = await screen.findByLabelText("Mobile number");

        /* Mock signup api call */
        axios.post.mockResolvedValueOnce({});
        api.users.signup.mockResolvedValueOnce({});

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(nameInput, firstname);
        await userEvent.type(surnameInput, lastname);
        await userEvent.type(passwordInput, password);
        await userEvent.type(mobileInput, mobile);

        /* Check data is inserted correctly */
        expect(signupForm).toHaveFormValues({
            "email": validEmail,
            "firstname": firstname,
            "lastname": lastname,
            "mobile": mobile,
            "password": password,
            "role": role,
        });

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check no error is shown */
        await waitFor(() => {
            expect(roleInput).not.toHaveClass('is-invalid');
            expect(emailInput).not.toHaveClass('is-invalid');
            expect(passwordInput).not.toHaveClass('is-invalid');
            expect(nameInput).not.toHaveClass('is-invalid');
            expect(surnameInput).not.toHaveClass('is-invalid');
            expect(mobileInput).not.toHaveClass('is-invalid');
        });

        /* Check api call is made */
        await waitFor(async () => {
            expect(api.users.signup).toHaveBeenCalledTimes(1);
            expect(api.users.signup).toHaveBeenCalledWith({
                email: validEmail,
                password: password,
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

        /* Check fields have been reset */
        expect(signupForm).toHaveFormValues({
            "email": "",
            "password": "",
            "role": "Hiker"
        });

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
        nameInput = await screen.findByLabelText("Name");
        surnameInput = await screen.findByLabelText("Surname");
        mobileInput = await screen.findByLabelText("Mobile number");

        /* Mock signup api call */
        axios.post.mockResolvedValueOnce({});
        api.users.signup.mockRejectedValue({
            message: mockUnsuccessfulRegistrationMessage
        });

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(nameInput, firstname);
        await userEvent.type(surnameInput, lastname);
        await userEvent.type(passwordInput, password);
        await userEvent.type(mobileInput, mobile);

        /* Check data is inserted correctly */
        expect(signupForm).toHaveFormValues({
            "email": validEmail,
            "firstname": firstname,
            "lastname": lastname,
            "mobile": mobile,
            "password": password,
            "role": role,
        });

        /* Submit the form to trigger form validation */
        await userEvent.click(submitButton);

        /* Check no error is shown */
        await waitFor(() => {
            expect(roleInput).not.toHaveClass('is-invalid');
            expect(emailInput).not.toHaveClass('is-invalid');
            expect(passwordInput).not.toHaveClass('is-invalid');
            expect(nameInput).not.toHaveClass('is-invalid');
            expect(surnameInput).not.toHaveClass('is-invalid');
            expect(mobileInput).not.toHaveClass('is-invalid');
        });

        /* Check api call is made */
        await waitFor(async () => {
            expect(api.users.signup).toHaveBeenCalledTimes(1);
            expect(api.users.signup).toHaveBeenCalledWith({
                email: validEmail,
                password: password,
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

        /* Mock signup/resend mail api call */
        axios.post.mockResolvedValueOnce({});
        axios.put.mockResolvedValueOnce({});
        api.users.signup.mockResolvedValueOnce({});
        api.users.sendVerificationCode.mockResolvedValueOnce({});

        /* Enter valid input */
        await userEvent.type(emailInput, validEmail);
        await userEvent.type(passwordInput, password);

        /* Check data is inserted correctly */
        expect(signupForm).toHaveFormValues({
            "email": validEmail,
            "password": password,
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
            expect(api.users.sendVerificationCode).toHaveBeenCalledWith(validEmail);
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith("We have sent you a new activation email", { "theme": "colored" });
        });
    });

});