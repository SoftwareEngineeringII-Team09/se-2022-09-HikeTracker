import * as Yup from 'yup'

import { __PROVINCES, getCitiesForProvince } from '@lib/helpers/location'

const FiltersSchema = Yup.object().shape({
    geoArea: Yup.object().shape({
        location: Yup.object().shape({
            province: Yup.number().oneOf(
                [...Object.values(__PROVINCES)
                    .map(prov => prov.istat_provincia), 0],
                "Value must match with one of selectable ones"),
            city: Yup.number().test('City is within the selected province', 'Value must match with one of selectable ones',
                (value, ctx) => (
                    getCitiesForProvince(ctx.parent.province)
                        .map(c => c.codiceistatcomune)
                        .includes(value)) || value === 0
            )
        }),
        position: Yup.object().shape({
            radius: Yup.number(),
            point: Yup.object().shape({
                lat: Yup.number().nullable(),
                lng: Yup.number().nullable()
            })
        })
    }),
    difficulty: Yup.object().shape({
        tourist: Yup.bool(),
        hiker: Yup.bool(),
        professional: Yup.bool(),
    }),
    length: Yup.object().shape({
        min: Yup.number()
            .positive("Min length must be a positive number")
            .lessThan(Yup.ref("max"), "Min length must be less than max length"),
        max: Yup.number()
            .positive("Max length must be a positive number")
            .moreThan(Yup.ref("min"), "Max length must be more than min length"),
    }),
    totalAscent: Yup.object().shape({
        min: Yup.number()
            .positive("Min ascent must be a positive number")
            .lessThan(Yup.ref("max"), "Min ascent must be less than max ascent"),
        max: Yup.number()
            .positive("Max ascent must be a positive number")
            .moreThan(Yup.ref("min"), "Max ascent must be more than min ascent"),
    }),
    expectedTime: Yup.object().shape({
        min: Yup.number()
            .positive("Min time must be a positive number")
            .lessThan(Yup.ref("max"), "Min time must be less than max time"),
        max: Yup.number()
            .positive("Max time must be a positive number")
            .moreThan(Yup.ref("min"), "Max time must be more than min time"),
    })
})

export default FiltersSchema