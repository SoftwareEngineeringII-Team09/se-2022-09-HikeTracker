import { useState } from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from "react-toastify";
import api from '@services/api';
import { Formik, Form } from 'formik';

import { SignupSchema } from '@lib/validations';
import { Select, Input, LoadingButton } from '@components/form';

const Signup = () => {

    const [successfulSignup, setSuccessfulSignup] = useState(false);
    const [userId, setUserId] = useState(0);
    const [loading, setLoading] = useState(false);

    /* User Roles */
    const roles = [
        { name: "Hiker", requiresAdditionalInfo: false },
        { name: "Local Guide", requiresAdditionalInfo: true },
        { name: "Hut Worker", requiresAdditionalInfo: true },
        { name: "Emergency Operator", requiresAdditionalInfo: true },
    ];

    const initialValues = {
        role: 'Hiker',
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const rolesRequiringAdditionalInfo = roles.filter((r) => r.requiresAdditionalInfo).map((r) => r.name);

    /* Request new token */
    const requestNewToken = async () => {
        try {
            await api.users.sendVerificationCode(userId);
            toast.success("We have sent you a new activation email", {
                theme: "colored",
            });
        } catch (error) {
            toast.error("There has been an error generating a new activation link, please try again", {
                theme: "colored",
            });
        }
    };

    /* Signup submission */
    const submitSignup = async (values, actions) => {
        try {
            setLoading(true);
            const userId = await api.users.signup(values);
            setUserId(userId);
            setSuccessfulSignup(true);
            // Reset form values
            actions.resetForm({
                values: {
                    ...initialValues,
                    role: values.role,
                },
            });
        } catch (error) {
            toast.error(error, {
                theme: "colored"
            });
        } finally {
            actions.setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <div className='my-5'>
            <h1 className="fw-bold text-center mb-5">Register</h1>
            {
                successfulSignup &&
                <Alert variant="success" className='my-5'>
                    <Alert.Heading className='fw-bold'>Welcome!</Alert.Heading>
                    <p>
                        Your account has been created, we have sent you an email to activate your account.
                        If you didn't receive it, please check your spam folder, or click the button below to resend it.
                    </p>
                    <hr />
                    <Button className="mb-0" variant="base-light" onClick={requestNewToken}>Receive a new activation link</Button>
                </Alert>
            }
            <Formik className="my-2" initialValues={initialValues} validationSchema={SignupSchema} onSubmit={(values, actions) => submitSignup(values, actions)}>
                {({ values }) => {
                    return (<Form data-testid="signup">
                        <Row>
                            <Col xs={12} lg={6}>
                                <Select id="role" name="role" defaultLabel="Select your role" label="Who are you?" className="mb-3">
                                    {roles.map((currentRole) => <option key={currentRole.name} value={currentRole.name} id={currentRole.name}>{currentRole.name}</option>)}
                                </Select>
                            </Col>
                            <Col xs={12} lg={6}>
                                <Input id="email" name="email" type="email" label="Email" placeholder="example@email.com" className="mb-3" />
                            </Col>
                            <Col xs={12} lg={6}>
                                <Input id="password" name="password" type="password" label="Password" placeholder="••••••••••••" className="mb-3" />
                            </Col>
                            <Col xs={12} lg={6}>
                                <Input id="password-confirm" name="confirmPassword" type="password" label="Confirm password" placeholder="••••••••••••" className="mb-3" />
                            </Col>
                            {rolesRequiringAdditionalInfo.includes(values.role) &&
                                <>
                                    <Col xs={12} lg={6}>
                                        <Input id="firstname" name="firstname" type="text" label="First name" placeholder="Tony" className="mb-3" />
                                    </Col>
                                    <Col xs={12} lg={6}>
                                        <Input id="lastname" name="lastname" type="text" label="Last name" placeholder="Stark" className="mb-3" />
                                    </Col>
                                    <Col xs={12} lg={6}>
                                        <Input id="mobile" name="mobile" type="tel" label="Mobile number" placeholder="Your mobile number" className="mb-3" />
                                    </Col>
                                </>
                            }
                        </Row>
                        <LoadingButton text="Register" type="submit" loading={loading} />
                    </Form>
                    )
                }}
            </Formik>

        </div>
    );

}

export default Signup;