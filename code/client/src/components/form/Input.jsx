import { Form } from "react-bootstrap";
import classNames from "classnames";

import { Field, ErrorMessage, useField } from "formik";

const Input = ({ id, name, type, placeholder, disabled, className, label, min = null, max = null, step = null }) => {
    const [field, meta] = useField(name);

    const classes = classNames({
        'form-control text-dark bg-base-light rounded-3 p-3': true,
        'border-0': !meta.touched,
        'is-invalid': meta.touched && meta.error,
        'is-valid': meta.touched && !meta.error,
        'bg-base opacity-50': disabled
    })

    return (
        <Form.Group className={className}>
            <Form.Label htmlFor={id} className="fw-semibold text-primary-dark" >{label}</Form.Label>
            <Field id={id} name={field.name} type={type} placeholder={placeholder} className={classes} disabled={disabled}
                min={min} max={max} step={step} />
            {(meta.touched && meta.error) &&
                <Form.Text data-testid="error-message" className='text-danger'>
                    <ErrorMessage name={field.name} />
                </Form.Text>}
        </Form.Group>
    );
}

export default Input;