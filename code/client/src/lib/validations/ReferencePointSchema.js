import * as Yup from 'yup'

const ReferencePointSchema = Yup.object().shape({
    referencePointName: Yup.string().required(),
    point: Yup.object().shape({
        longitude: Yup.number().required(),
        latitude: Yup.number().required(),
    })
})

export default ReferencePointSchema