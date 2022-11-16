import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from '../../services/api';
import { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../../contexts/authContext';

const LoginForm = () => {

    const navigate = useNavigate();
    const [, requestLoginUpdate] = useContext(AuthContext);

    /* Login data Validation schema */
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('This is not a valid email address')
            .required('Insert your email address'),
        password: Yup.string()
            .required('Insert your password')
    });

    /* Login submission */
    const submitLogin = (values, { setSubmitting }) => {
        api.login(values)
            .then(() => {
                requestLoginUpdate(true);
                navigate('/');
            })
            .catch((error) => {
                toast.error(error.message, {
                    theme: "colored"
                });
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const initialValues = {
        email: '',
        password: ''
    };

    return (
        <Col className="minWidthForm">
            <h1 className="font-weight-bold text-center pb-4">Login</h1>
            <Formik className="my-2" initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitLogin}>
                {
                    loginValidation =>
                    (
                        <Form onSubmit={loginValidation.handleSubmit} data-testid="login">
                            <Form.Group className="mb-3" controlId="userEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" className={loginValidation.touched.email && loginValidation.errors.email ? 'is-invalid' : ''} placeholder="Your email" {...loginValidation.getFieldProps('email')} />
                                {loginValidation.touched.email && loginValidation.errors.email && <div className="invalid-feedback d-block">{loginValidation.errors.email}</div>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" className={loginValidation.touched.password && loginValidation.errors.password ? 'is-invalid' : ''} placeholder="Your password" {...loginValidation.getFieldProps('password')} />
                                {loginValidation.touched.password && loginValidation.errors.password && <div className="invalid-feedback d-block">{loginValidation.errors.password}</div>}
                            </Form.Group>
                            <Button variant="primary" type="submit" className="p-3 mx-auto d-block my-3">Login</Button>
                        </Form>
                    )
                }
            </Formik>
        </Col>
    );

}

export default LoginForm;