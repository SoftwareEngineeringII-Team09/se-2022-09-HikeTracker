import classnames from 'classnames'

const FilterRadioButton = ({ active, children, ...props }) => {
    const classes = classnames({
        "px-3 py-2 rounded-3 fw-bold me-2 mt-2": true,
        "bg-primary-dark text-base-light": active,
        "bg-base-light text-primary-dark": !active,
    })

    return (
        <div role="button" className={classes} {...props}>
            <span>{children}</span>
        </div>
    )
}

export default FilterRadioButton