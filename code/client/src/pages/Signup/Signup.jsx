import { Form, InputGroup, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { toast } from "react-toastify";
import api from '../../services/api';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Signup = () => {

    /* User Roles */
    const roles = [
        { name: "Hiker", requiresAdditionalInfo: false },
        { name: "Local Guide", requiresAdditionalInfo: false },
        { name: "Hut Worker", requiresAdditionalInfo: true },
        { name: "Emergency Operator", requiresAdditionalInfo: true },
    ];
    const [successfulSignup, setSuccessfulSignup] = useState(false);
    const [registrationEmail, setRegistrationEmail] = useState("");
    const rolesRequiringAdditionalInfo = roles.filter((r) => r.requiresAdditionalInfo).map((r) => r.name);

    /* Request new token */
    const requestNewToken = async () => {
        try {
            await api.users.sendVerificationCode(registrationEmail);
            toast.success("We have sent you a new activation email", {
                theme: "colored",
            });
        } catch (error) {
            toast.error("There has been an error generating a new activation link, please try again", {
                theme: "colored",
            });
        }
    };

    /* Signup data Validation schema */
    const mobileRegExp = /^(\+[1-9]{1,4}\s?)?[0-9]{3,12}$/;
    const validationSchema = Yup.object({
        role: Yup.mixed().oneOf(roles.map((currentRole) => currentRole.name)),
        firstname: Yup.string()
            .max(40, 'First name must be 40 characters or less')
            .when("role", {
                is: (r) => rolesRequiringAdditionalInfo.includes(r),
                then: Yup.string().required("Please provide your name")
            }),
        lastname: Yup.string()
            .max(40, 'Last name must be 40 characters or less')
            .when("role", {
                is: (r) => rolesRequiringAdditionalInfo.includes(r),
                then: Yup.string().required("Please provide your surname")
            }),
        mobile: Yup.string()
            .matches(mobileRegExp, 'Provide a valid mobile number')
            .when("role", {
                is: (r) => rolesRequiringAdditionalInfo.includes(r),
                then: Yup.string().required("Please provide your mobile number")
            }),
        email: Yup.string()
            .email('This is not a valid email address')
            .required('Insert your email address'),
        password: Yup.string()
            .min(8, 'Please provide a password of at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-+;,.:()'"])/, 'Please provide a password containing at least one lowercase letter, one uppercase letter, one number and one special character')
            .required('Insert your password')
    });

    /* Signup submission */
    const submitSignup = async (values, { setSubmitting, resetForm }) => {
        try {
            await api.users.signup(values);
            setRegistrationEmail(values.email);
            setSuccessfulSignup(true);
            /* Clear form inputs */
            resetForm();
        } catch (error) {
            toast.error(error, {
                theme: "colored"

            });
        }
    }

    const initialValues = {
        role: 'Hiker',
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        password: ''
    };

    return (
        <Col className="minWidthForm">
            <h1 className="font-weight-bold text-center pb-4">Register</h1>
            <Formik className="my-2" initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitSignup}>
                {
                    validation =>
                    (
                        <Form onSubmit={validation.handleSubmit} data-testid="signup">
                            <Form.Label htmlFor="role">Who are you?</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="user-role">I am a</InputGroup.Text>
                                <Form.Select aria-label="Select user role" id="role" {...validation.getFieldProps('role')} className={validation.touched.role && validation.errors.role ? 'is-invalid' : ''}>
                                    {roles.map((currentRole) => <option key={currentRole.name} value={currentRole.name} id={currentRole.name}>{currentRole.name}</option>)}
                                </Form.Select>
                                {validation.touched.role && validation.errors.role && <div className="invalid-feedback d-block">{validation.errors.role}</div>}
                            </InputGroup>
                            <Form.Group className="mb-3" controlId="userEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Your email" {...validation.getFieldProps('email')} className={validation.touched.email && validation.errors.email ? 'is-invalid' : ''} />
                                {validation.touched.email && validation.errors.email && <div className="invalid-feedback d-block">{validation.errors.email}</div>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Your password" {...validation.getFieldProps('password')} className={validation.touched.password && validation.errors.password ? 'is-invalid' : ''} />
                                {validation.touched.password && validation.errors.password && <div className="invalid-feedback d-block">{validation.errors.password}</div>}
                            </Form.Group>
                            {
                                // Check if the selected role requires additional information
                                rolesRequiringAdditionalInfo.includes(validation.values.role) &&
                                <Container variant="fluid" className="px-0">
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group className="mb-3" controlId="userName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" placeholder="Your name" {...validation.getFieldProps('firstname')} className={validation.touched.firstname && validation.errors.firstname ? 'is-invalid' : ''} />
                                                {validation.touched.firstname && validation.errors.firstname && <div className="invalid-feedback d-block">{validation.errors.firstname}</div>}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-3" controlId="userSurname">
                                                <Form.Label>Surname</Form.Label>
                                                <Form.Control type="text" placeholder="Your surname" {...validation.getFieldProps('lastname')} className={validation.touched.lastname && validation.errors.lastname ? 'is-invalid' : ''} />
                                                {validation.touched.lastname && validation.errors.lastname && <div className="invalid-feedback d-block">{validation.errors.lastname}</div>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="userMobile">
                                        <Form.Label>Mobile number</Form.Label>
                                        <Form.Control type="text" placeholder="Your mobile number" {...validation.getFieldProps('mobile')} className={validation.touched.mobile && validation.errors.mobile ? 'is-invalid' : ''} />
                                        {validation.touched.mobile && validation.errors.mobile && <div className="invalid-feedback d-block">{validation.errors.mobile}</div>}
                                    </Form.Group>
                                </Container>
                            }
                            <Button variant="primary" type="submit" className="p-3 mx-auto d-block my-3">
                                Register
                            </Button>
                        </Form>
                    )
                }
            </Formik>
            {
                successfulSignup &&
                <Alert variant="success">
                    <Alert.Heading>Welcome!</Alert.Heading>
                    <p>
                        Your account has been created, we have sent you an email to activate your account.
                        If you didn't receive it, please check your spam folder, or click the button below to resend it.
                    </p>
                    <hr />
                    <Button className="mb-0" variant="light" onClick={requestNewToken}>Receive a new activation link</Button>
                </Alert>
            }
        </Col>
    );

}

export default Signup;