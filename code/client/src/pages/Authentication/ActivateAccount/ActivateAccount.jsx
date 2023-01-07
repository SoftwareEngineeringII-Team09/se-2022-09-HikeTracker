import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Col, Alert, Spinner } from 'react-bootstrap';

import api from '@services/api';

const ActivateAccount = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const userId = searchParams.get("id");
    const token = searchParams.get("token");
    const navigate = useNavigate();

    /* Activation request */
    const activateAccount = async () => {
        try {
            await api.users.verifyEmail({ userId, token });
            setStatus("success");
        } catch (error) {
            setStatus("error");
        }
    };

    /* Request new token */
    async function requestNewToken() {
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
    }

    useEffect(() => {
        /* Redirect to Home if activation token or userId are missing */
        if (!token || !userId) {
            navigate('/');
            toast.error("There has been an error with your activtion link, please try again", { theme: 'colored' })
        } else activateAccount();
    }, []); // eslint-disable-line

    return (
        <Col>
            {   /* Waiting for activation results */
                status === "loading" && <>
                    <h1>Activating account...</h1>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </>
            }

            {   /* Successful activation */
                status === "success" && <>
                    <h1>Your account has been activated!</h1>
                    <Button variant="primary" href="/login">Login</Button>
                </>
            }

            {   /* Error in activation */
                status === "error" && <>
                    <h1>Activation failed</h1>
                    <Alert variant="warning">
                        <Alert.Heading>Something went wrong, but don't worry!</Alert.Heading>
                        <p>
                            The activation link you followed was invalid or has expired.
                            Please click on the button below to receive a new activiation link at your email.
                        </p>
                        <hr />
                        <Button className="mb-0" variant="light" onClick={requestNewToken}>Receive a new activation link</Button>
                    </Alert>
                </>
            }
        </Col>
    );

}

export default ActivateAccount;