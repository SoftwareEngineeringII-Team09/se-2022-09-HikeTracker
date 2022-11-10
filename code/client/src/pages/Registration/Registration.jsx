import { useState } from 'react';
import { Form, InputGroup, Button, Container, Row, Col } from 'react-bootstrap';

const Registration = () => {

    /* User Roles */
    const roles = [
        { name: "Hiker", requiresAdditionalInfo: false },
        { name: "Local Guide", requiresAdditionalInfo: false },
        { name: "Hut Worker", requiresAdditionalInfo: true },
        { name: "Emergency Operator", requiresAdditionalInfo: true },
    ];

    /* User profile information */
    const [role, setRole] = useState(roles[0].name);
    const [password, setPassword] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [validated, setValidated] = useState(false);

    /* Registration submission */
    const handleSubmit = async () => {
    //     if (await )
    }

    /* Input validaiton */


    return (
        <Col className="minWidthForm">
            <h1 className="font-weight-bold text-center pb-4">Register</h1>
            <Form className="my-2" noValidate validated={validated} onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="user-role">I am a</InputGroup.Text>
                    <Form.Select aria-label="Select user role" value={role} onChange={(e) => setRole(e.target.value)}>
                        {roles.map((currentRole) => <option value={currentRole.name} id={currentRole.name}>{currentRole.name}</option>)}
                    </Form.Select>
                </InputGroup>
                <Form.Group className="mb-3" controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Please provide a valid email address.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="userPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Please provide a password of at least 8 characters.</Form.Control.Feedback>
                </Form.Group>
                {
                    // Check if the selected role requires additional information
                    roles.filter((r) => r.requiresAdditionalInfo).map((r) => r.name).includes(role) &&
                    <Container variant="fluid" className="px-0">
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="userName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">Please provide your name.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3" controlId="userSurname">
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text" placeholder="Your surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">Please provide your surname.</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="userPhone">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control type="text" placeholder="Your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <Form.Control.Feedback type="invalid">Please provide a valid phone number.</Form.Control.Feedback>
                        </Form.Group>
                    </Container>
                }
                <Button variant="primary" type="submit" className="p-3 mx-auto d-block my-3">Register</Button>
            </Form>
        </Col>
    );

}

export default Registration;