import { useContext, useCallback } from "react"
import { Button } from "react-bootstrap"
import { Formik, Form } from "formik"

import { FiltersSchema } from '@lib/validations'
import { FiltersContextHuts } from "@contexts/FiltersContextHuts"

import * as Filters from './Filters'

const FiltersForm = ({ onSubmit, onReset }) => {
    const { filters } = useContext(FiltersContextHuts)

    const handleSubmit = useCallback((values) => onSubmit(values), []) // eslint-disable-line

    return (
        <Formik initialValues={filters} validationSchema={FiltersSchema} onSubmit={handleSubmit} onReset={onReset}>
            {() => {
                return (
                    <Form>
                        <Filters.GeoArea />
                        <Filters.Specs />
                        <div className="d-flex mb-5">
                            <Button type="reset" variant="base" size="lg" className="fw-bold w-100 py-3 me-3">
                                Cancel and Reset filters
                            </Button>
                            <Button type="submit" variant="primary-dark" size="lg" className="fw-bold w-100 py-3">
                                Apply
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    )
}

export default FiltersForm