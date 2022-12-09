import { Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useState } from 'react';
import api from '@services/api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '@contexts/authContext';

import { Input, LoadingButton } from '@components/form'

const LoginForm = () => {

    const navigate = useNavigate();
    const [, requestLoginUpdate] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            await api.users.login(values);
            requestLoginUpdate(true);
            navigate('/');
        } catch (error) {
            toast.error(error, {
                theme: "colored"
            });
        } finally {
            setSubmitting(false);
            setLoading(false);
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
                            <LoadingButton text="Login" type="submit" loading={loading} />
                        </Col>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default LoginForm;