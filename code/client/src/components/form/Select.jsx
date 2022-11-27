import { Form, InputGroup } from "react-bootstrap";
import classNames from "classnames";

import { Field, ErrorMessage, useField } from "formik";

const Select = ({ id, name, defaultValue = 0, defaultLabel = "", disabled, label, className, children }) => {
    const [field, meta] = useField(name);

    const classes = classNames({
        'form-select text-dark bg-base-light rounded-3 p-3': true,
        'border-0': !meta.touched,
        'is-invalid': meta.touched && meta.error,
        'is-valid': meta.touched && !meta.error,
        'bg-base opacity-50': disabled
    })

    return (
        <Form.Group className={className}>
            <Form.Label htmlFor={id} className="fw-medium">{label}</Form.Label>
            <Field as="select" id={id} name={name} className={classes} disabled={disabled}>
                <option value={defaultValue}>{defaultLabel}</option>
                {children}
            </Field>
            {(meta.touched && meta.error) &&
                <Form.Text data-testid="error-message" className='text-danger'>
                    <ErrorMessage name={field.name} />
                </Form.Text>}
        </Form.Group>
    );
}

export default Select