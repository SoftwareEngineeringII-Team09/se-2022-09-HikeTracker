import * as Yup from 'yup';

import { __REGIONS, getProvincesForRegion, getCitiesForProvince } from '@lib/helpers/location'

const mobileRegExp = /^(\+[1-9]{1,4}\s?)?\d{3,12}$/;

const HutSchema = Yup.object().shape({
    hutName: Yup.string()
        .max(40, 'Hut name must be 40 characters or less')
        .required("Please provide a name for the hut"),
    region: Yup.number().oneOf(
        [...Object.values(__REGIONS)
            .map(reg => reg.regione)],
        "Value must match with one of selectable ones").integer(),
    province: Yup.number().test('Province is within the selected region', 'Value must match with one of selectable ones',
        (value, ctx) => (
            getProvincesForRegion(ctx.parent.region)
                .map(p => p.provincia)
                .includes(value))
    ).integer(),
    city: Yup.number().test('City is within the selected province', 'Value must match with one of selectable ones',
        (value, ctx) => (
            getCitiesForProvince(ctx.parent.province)
                .map(c => c.comune)
                .includes(value))
    ).integer(),
    numOfBeds: Yup.number()
        .required("Please provide the number of beds for the hut")
        .min(0, "The number of beds must be 0 or higher").integer(),
    cost: Yup.number()
        .required("Please provide the cost per night at the hut")
        .min(0, "The cost must be 0 or higher"),
    altitude: Yup.number()
        .required("Please provide the altitude where the hut is located")
        .min(0, "The altitude must be 0 or higher")
        .max(10000, "The altitude cannot exceed 10000 meters"),
    phone: Yup.string()
        .required('Provide a phone number')
        .matches(mobileRegExp, 'Provide a valid phone number'),
    website: Yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]{1,64}(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]{1,64}){0,6}\/?$/,
            "Provide a valid website"
        ).nullable(),
    email: Yup.string()
        .email('This is not a valid email address')
        .required('Insert your email address'),
    hutImage: Yup.mixed().required()
        .test('fileFormat', 'Provide a valid image', (value) => {
            if (!value) return false;
            if (value.type)
                return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
            const format = value.split('.').pop();
            return ['jpg', 'jpeg', 'gif', 'png'].includes(format);
        })
});

export default HutSchema;