import { Spinner, Button } from "react-bootstrap";

const LoadingButton = ({ text, type, loading }) => {

    return (
        <Button variant="primary-dark" type={type} size='lg' className="w-100 py-3 fw-bold mt-3" disabled={loading}>
            {loading ? <Spinner /> : text}
        </Button>
    )
}

export default LoadingButton;