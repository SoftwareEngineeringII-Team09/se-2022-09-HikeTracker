import { Button, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from '@services/api';
import { useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '@contexts/authContext';

import { Input } from '@components/form'

const LoginForm = () => {

    const navigate = useNavigate();
    const [, requestLoginUpdate] = useContext(AuthContext);

    /* Login data Validation schema */
    const validationSchema = Yup.object({
        username: Yup.string()
            .email('This is not a valid email address')
            .required('Insert your email address'),
        password: Yup.string()
            .required('Insert your password')
    });

    /* Login submission */
    const submitLogin = async (values, { setSubmitting }) => {
        try {
            const user = await api.users.login(values);
            requestLoginUpdate(true);
            navigate('/');
            toast.success(`Welcome, ${user.firstname || "Hiker"}!`, {
                theme: "colored"
            });
        } catch (error) {
            toast.error(error, {
                theme: "colored"
            });
        } finally {
            setSubmitting(false);
        }
    };

    const initialValues = {
        username: '',
        password: ''
    };

    return (
        <div>
            <h1 className="fw-bold text-center mb-5">Login</h1>
            <Formik className="my-2" initialValues={initialValues} validationSchema={validationSchema} onSubmit={submitLogin}>
                {(
                    <Form data-testid="login" className='d-flex flex-column align-items-center'>
                        <Col xs={12} lg={7} className="mb-4">
                            <Input id="username" name="username" type="email" label="Email" placeholder="example@mail.com" />
                        </Col>
                        <Col xs={12} lg={7} className="mb-5">
                            <Input id="password" name="password" type="password" label="Password" placeholder="••••••••••••" />
                        </Col>
                        <Col xs={12} lg={7}>
                            <Button variant="primary-dark" type="submit" size='lg' className="py-3 fw-bold w-100">Login</Button>
                        </Col>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default LoginForm;