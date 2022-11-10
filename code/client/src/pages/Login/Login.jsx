import { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';

const LoginForm = () => {

    /* User profile information */
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [validated, setValidated] = useState(false);

    /* Login submission */
    const handleSubmit = async () => {
    //     if (await )
    }

    /* Input validaiton */


    return (
        <Col className="minWidthForm">
            <h1 className="font-weight-bold text-center pb-4">Login</h1>
            <Form className="my-2" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="userEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Please provide a valid email address.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="userPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit" className="p-3 mx-auto d-block my-3">Login</Button>
            </Form>
        </Col>
    );

}

export default LoginForm;