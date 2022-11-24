import classnames from 'classnames'

import { useField, Field } from "formik";

const Check = ({ id, name, label, ...props }) => {
    const [field, meta] = useField(name);

    const classes = classnames({
        "px-3 py-2 rounded-3 fw-bold me-2 mt-2": true,
        "bg-primary-dark text-base-light": meta.value,
        "bg-base-light text-primary-dark": !meta.value,
    })

    return (
        <label className={classes} role="button">
            <Field id={id} type="checkbox" hidden name={field.name} label={label} {...props} />
            {label}
        </label>


    )
}

export default Check