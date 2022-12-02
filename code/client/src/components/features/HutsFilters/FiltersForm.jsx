import { useContext } from "react"
import { Button } from "react-bootstrap"
import { Formik, Form } from "formik"

import { FiltersSchema } from '@lib/validations'
import { FiltersContext } from "@contexts/FiltersContext"

import * as Filters from './Filters'

const FiltersForm = ({ onSubmit, onReset }) => {
    const { filters } = useContext(FiltersContext)

    return (
        <Formik initialValues={filters} validationSchema={FiltersSchema} onSubmit={(values) => onSubmit(values)} onReset={onReset}>
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